'use strict';

const cloudinary = require('cloudinary');
const Database = use('Database');
const Hashids = require('hashids/cjs');
const hashids = new Hashids('', 9);
const Env = use('Env');
const Issue = use('App/Models/Issue');

cloudinary.config({
  cloud_name: Env.get('CLOUDINARY_CLOUD'),
  api_key: Env.get('CLOUDINARY_KEY'),
  api_secret: Env.get('CLOUDINARY_SECRET'),
});

class IssueController {
  /* 
    Helper Functions 
  */
  async handleNotification(type, payload) {
    /*
     * Type denotes notification type
     * 1: New issue assignee
     * 2: Updated issue assignee
     * 3: Comments on a task
     * 4: New user joined team (only shown to owner)
     */
    try {
      const { assignee, issue, issueId, oldAssignee, sourceUser, roomId } = payload;
      if (type <= 2) {
        if (assignee === oldAssignee) return; // does this cause issues?
        if (assignee && assignee.length > 0 && assignee !== sourceUser) {
          let [user_data] = await Database.from('users').select('id').where('email', assignee);
          let [data] = await Database.table('user_rooms')
            .where('user_id', user_data.id)
            .where('room_id', roomId)
            .select('notifications');
          data.notifications.push({
            assignee,
            date: new Date(),
            issue,
            issueId,
            notificationId: data.notifications.length,
            sourceUser,
            status: 0,
            type: 1,
          });
          await Database.table('user_rooms')
            .where('user_id', user_data.id)
            .where('room_id', roomId)
            .update('notifications', JSON.stringify(data.notifications));
        }

        // Need to notify previous assignee that another user has been assigned the issue
        if (type === 2) {
          if (assignee && assignee.length > 0 && oldAssignee != null && oldAssignee != sourceUser) {
            const [idObj] = await Database.table('users').select('id').where('email', oldAssignee);

            let [data] = await Database.table('user_rooms')
              .where('user_id', idObj.id)
              .where('room_id', roomId)
              .select('notifications');
            data.notifications.push({
              assignee,
              date: new Date(),
              issue,
              issueId,
              notificationId: data.notifications.length,
              status: 0,
              type: 2,
            });

            await Database.table('user_rooms')
              .where('user_id', idObj.id)
              .where('room_id', roomId)
              .update('notifications', JSON.stringify(data.notifications));
          }
        }
      } else if (type === 3) {
        let [user_data] = await Database.from('users').select('id').where('email', assignee);
        let [data] = await Database.table('user_rooms')
          .where('user_id', user_data.id)
          .where('room_id', roomId)
          .select('notifications');
        data.notifications.push({
          assignee,
          date: new Date(),
          issue,
          issueId,
          notificationId: data.notifications.length,
          sourceUser,
          status: 0,
          type: 3,
        });
        await Database.table('user_rooms')
          .where('user_id', user_data.id)
          .where('room_id', roomId)
          .update('notifications', JSON.stringify(data.notifications));
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }

  /* 
    Controller Methods for Endpoints
  */

  async create({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const { assignee, deadline, description, dragger, priority, status, shortDescription, tag, title } = request.body;
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const issue = new Issue();
      const imagePromises = [];
      const imageIdArray = [];
      for (let item of dragger) {
        imagePromises.push(
          new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload(
              item,
              {
                resource_type: 'auto',
              },
              (error, res) => {
                console.log(res);
                if (error) {
                  reject(new Error('Cloudinary image upload failed'));
                } else {
                  imageIdArray.push({ id: res.public_id, url: res.url });
                  resolve();
                }
              }
            );
          })
        );
      }
      await Promise.all(imagePromises);
      issue.fill({
        title,
        room: decryptedRoomId,
        shortDescription,
        deadline: deadline ? deadline.toString() : null,
        description,
        assignee,
        creator: user.email,
        priority: priority || 0,
        status: status || 0,
        image: JSON.stringify(imageIdArray),
        tag: JSON.stringify(tag),
        comments: JSON.stringify([]),
      });
      await issue.save();

      // Handle notification for assignee
      if (assignee) {
        await this.handleNotification(1, {
          assignee,
          issue: title,
          issueId: issue.id,
          sourceUser: user.email,
          roomId: decryptedRoomId,
        });
      }

      await Database.table('logs').insert({
        room_id: decryptedRoomId,
        issue_id: issue.id,
        description:
          status === 0 ? `${user.email} created the backlog issue ` : `${user.email} created the active issue `,
        object: title,
        date: new Date().toString(),
        type: 0,
      });

      response.status(200).json({
        status: status === 0 ? 'backlog' : 'dashboard',
      });
    } catch (err) {
      console.log(`(issue_create) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async delete({ auth, request, response }) {
    // will need to add more logic for administration levels
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));
      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);

      if (result.length === 0) throw new Error('User not in this room');

      // Cloudinary image deletion code
      const issue = await Database.table('issues').where('id', request.params.id).select('image', 'status');

      const imagePromises = [];

      if (issue[0].image && Array.isArray(issue[0].image)) {
        for (let item of issue[0].image) {
          imagePromises.push(
            new Promise((resolve, reject) => {
              cloudinary.v2.uploader.destroy(item.id, (error, result) => {
                if (error) {
                  if (error.result !== 'not found') {
                    reject(new Error('Cloudinary image deletion failed'));
                  } else {
                    resolve();
                  }
                } else {
                  resolve();
                }
              });
            })
          );
        }
        await Promise.all(imagePromises);
      }

      await Database.transaction(async (trx) => {
        let [data] = await trx.table('issues').select('title').where('id', request.params.id);

        await trx.table('logs').insert({
          room_id: decryptedRoomId,
          description:
            issue[0].status === 3
              ? `${user.email} marked the following issue as complete: `
              : `${user.email} deleted issue `,
          object: data.title,
          date: new Date().toString(),
          type: 12,
        });

        const deletions = await trx.table('issues').where('id', request.params.id).delete();
        if (deletions == null) throw new Error('Issue could not be deleted as it was not found');
        else response.status(200).send();
      });
    } catch (err) {
      console.log(`(issue_delete) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  /* Controller handler function for getting specific issue data
   *
   */
  async get({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      let issueId = request.params.id;
      let [issue] = await Database.from('issues').where({ id: issueId });
      response.status(200).json({ issue });
    } catch (err) {
      console.log(`(issue_get) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async getTeam({ auth, request, response }) {
    try {
      // type of issue trying to be requested given by request.params.status (0 - backlog, 1 - active, 2 - )
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      if (request.params.status === '0') {
        const issues = await Database.table('issues').select('*').where({
          room: decryptedRoomId,
          status: 0,
        });
        response.status(200).send(issues);
      } else {
        const activeItems = await Database.table('issues').select('*').where({
          room: decryptedRoomId,
          status: 1,
        });
        const progressItems = await Database.table('issues').select('*').where({
          room: decryptedRoomId,
          status: 2,
        });
        const completedItems = await Database.table('issues').select('*').where({
          room: decryptedRoomId,
          status: 3,
        });

        response.status(200).send({
          activeItems,
          progressItems,
          completedItems,
        });
      }
    } catch (err) {
      console.log(`(issue_getTeam) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async getUser({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      if (request.params.status === 0) {
        const issues = await Database.table('issues').select('*').where({
          room: decryptedRoomId,
          assignee: user.email,
        });
        response.status(200).send(issues);
      } else {
        const activeItems = await Database.table('issues').select('*').where({
          room: decryptedRoomId,
          status: 1,
          assignee: user.email,
        });
        const progressItems = await Database.table('issues').select('*').where({
          room: decryptedRoomId,
          status: 2,
          assignee: user.email,
        });
        const completedItems = await Database.table('issues').select('*').where({
          room: decryptedRoomId,
          status: 3,
          assignee: user.email,
        });
        response.status(200).send({
          activeItems,
          progressItems,
          completedItems,
        });
      }
    } catch (err) {
      console.log(`(issue_getUser) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async getComments({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const data = await Database.table('issues').select('comments').where('id', request.params.id);
      response.status(200).json(data[0].comments);
    } catch (err) {
      console.log(`(issue_getComments) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async setComments({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      let data = await Database.table('issues')
        .select('comments', 'assignee', 'creator', 'title', 'id')
        .where('id', request.body.id);

      data[0].comments.push(request.body.comment);
      await Database.table('issues')
        .where({ room: decryptedRoomId, id: request.body.id })
        .update({
          comments: JSON.stringify(data[0].comments),
        });

      await Database.table('logs').insert({
        room_id: decryptedRoomId,
        issue_id: data[0].id,
        description: `${user.email} commented on issue `,
        object: data[0].title,
        date: new Date().toString(),
        type: 3,
      });

      // Should just revamp so that comments include user IDs (?)
      let comments = await Database.from('issues').select('comments').where('id', request.body.id);

      let watchers = new Set();
      for (let item of comments[0].comments) {
        if (item.author !== user.email) {
          watchers.add(item.author);
        }
      }

      if (data[0].assignee && data[0].assignee !== user.email) watchers.add(data[0].assignee);
      if (data[0].creator !== user.email) watchers.add(data[0].creator);

      for (let watcher of watchers) {
        await this.handleNotification(3, {
          issue: data[0].title,
          issueId: data[0].id,
          sourceUser: user.email,
          assignee: watcher,
          roomId: decryptedRoomId,
        });
      }
      response.status(200).send();
    } catch (err) {
      console.log(`(issue_setComments) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async update({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');
      const { title, shortDescription, deadline, description, assignee, tag, priority, status, dragger } = request.body;

      // Check here if assignee in DB is different or null for notifications
      let [dataAssignee] = await Database.table('issues').select('assignee').where('id', request.body.id);

      // If user is tier 1, can only edit issues assigned to them
      if (result[0].administration_level === 1 && user.email !== dataAssignee.assignee) {
        throw new Error('Unable to edit issues not directly assigned to user');
      }

      if (assignee) {
        await this.handleNotification(2, {
          assignee,
          issue: title,
          issueId: request.body.id,
          oldAssignee: dataAssignee.assignee,
          sourceUser: user.email,
          roomId: decryptedRoomId,
        });
      }

      if (dragger) {
        // Enters here if images were attached to the issue
        let imagePromises = [];
        const imageIdArray = [];

        // This block of code determines if there's a missing image reference - means that user wants it deleted
        const imageData = await Database.table('issues').select('image').where('id', request.body.id);

        const previousImages = dragger.reduce((accumulator, item) => {
          if (item.id != null) {
            accumulator.push(item.id);
            imageIdArray.push({ id: item.id, url: item.url });
          }
          return accumulator;
        }, []);

        let imagesToDelete = [];
        if (imageData[0].image && Array.isArray(imageData[0].image)) {
          imagesToDelete = imageData[0].image.filter((item) => {
            return !previousImages.includes(item.id);
          });
        }

        if (imagesToDelete.length > 0) {
          for (let item of imagesToDelete) {
            imagePromises.push(
              new Promise((resolve, reject) => {
                cloudinary.v2.uploader.destroy(item.id, (error, result) => {
                  if (error) {
                    if (error.result !== 'not found') {
                      reject(new Error('Cloudinary image deletion failed'));
                    } else {
                      resolve();
                    }
                  } else {
                    resolve();
                  }
                });
              })
            );
          }
          await Promise.all(imagePromises);
          imagePromises = [];
        }

        // Adding new updated images
        for (let item of dragger) {
          if (item.id == null) {
            imagePromises.push(
              new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload(
                  item,
                  {
                    resource_type: 'auto',
                  },
                  (error, res) => {
                    console.log(res);
                    if (error) {
                      reject(new Error('Cloudinary image upload failed'));
                    } else {
                      imageIdArray.push({ id: res.public_id, url: res.url });
                      resolve();
                    }
                  }
                );
              })
            );
          }
        }

        if (imagePromises.length > 0) {
          await Promise.all(imagePromises);
        }
        await Database.table('issues')
          .where({ room: decryptedRoomId, id: request.body.id })
          .update({
            title,
            shortDescription,
            description,
            deadline: deadline ? deadline.toString() : null,
            assignee,
            tag: JSON.stringify(tag),
            image: JSON.stringify(imageIdArray),
            priority,
            status,
          });
      } else {
        await Database.table('issues')
          .where({ room: decryptedRoomId, id: request.body.id })
          .update({
            title,
            shortDescription,
            description,
            deadline: deadline ? deadline.toString() : null,
            assignee,
            tag: JSON.stringify(tag),
            priority,
            status,
          });
      }
      await Database.table('logs').insert({
        room_id: decryptedRoomId,
        issue_id: request.body.id,
        description: `${user.email} updated issue `,
        object: title,
        date: new Date().toString(),
        type: 1,
      });
      response.status(200).send();
    } catch (err) {
      console.log(`(issue_update) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async updateProgress({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      await Database.transaction(async (trx) => {
        await trx
          .table('issues')
          .where({ room: decryptedRoomId, id: request.body.id })
          .update({ status: request.body.status });

        let [data] = await trx.table('issues').select('title', 'assignee').where('id', request.body.id);

        // If user is tier 1, can only edit issues assigned to them
        if (result[0].administration_level === 1 && user.email !== data.assignee) {
          throw new Error('Unable to edit issues not directly assigned to user');
        }

        await trx.table('logs').insert({
          room_id: decryptedRoomId,
          issue_id: request.body.id,
          description: `${user.email} updated issue `,
          object: data.title,
          date: new Date().toString(),
          type: 1,
        });
      });

      response.status(200).send();
    } catch (err) {
      console.log(`(issue_updateProgress) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  // Called when user uses 'Complete' button to dismiss all completed issues
  async endSprint({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      // Must be at least tier 2 to complete a sprint
      if (result[0].administration_level === 1) {
        throw new Error('Unable to edit issues not directly assigned to user');
      }

      const { issues, name } = request.body; // array containing issue IDs

      await Database.transaction(async (trx) => {
        // "issue.title, issue1.title, issue2.title..."
        let sprintObject = {};
        sprintObject.issues = issues.map((item) => item.title);
        sprintObject.name = name;

        for (let issue of issues) {
          let imagePromises = [];
          if (issue.image && Array.isArray(issue.image)) {
            for (let item of issue.image) {
              imagePromises.push(
                new Promise((resolve, reject) => {
                  cloudinary.v2.uploader.destroy(item.id, (error, result) => {
                    if (error) {
                      if (error.result !== 'not found') {
                        reject(new Error('Cloudinary image deletion failed'));
                      } else {
                        resolve();
                      }
                    } else {
                      resolve();
                    }
                  });
                })
              );
            }
            await Promise.all(imagePromises);
            await trx.table('issues').where('id', issue.id).delete();
          }
        }

        await trx.table('logs').insert({
          room_id: decryptedRoomId,
          description:
            name && name.length > 0
              ? `${user.email} ended $Sprint$ which contained the following issues: `
              : `${user.email} marked the following issues as completed: `,
          object: JSON.stringify(sprintObject),
          date: new Date().toString(),
          type: 13,
        });
      });

      response.status(200).send();
    } catch (err) {
      console.log(`(issue_endSprint) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async shareIssue({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const { issue, issueId, message, users } = request.body;
      let promiseArray = [];

      for (let email of users) {
        promiseArray.push(
          new Promise(async (resolve, reject) => {
            try {
              let [user_data] = await Database.from('users').select('id').where('email', email);
              let [data] = await Database.table('user_rooms')
                .where('user_id', user_data.id)
                .where('room_id', decryptedRoomId)
                .select('notifications');
              data.notifications.push({
                date: new Date(),
                issue,
                issueId,
                notificationId: data.notifications.length,
                sourceUser: user.email,
                message,
                status: 0,
                type: 4,
              });
              await Database.table('user_rooms')
                .where('user_id', user_data.id)
                .where('room_id', decryptedRoomId)
                .update('notifications', JSON.stringify(data.notifications));
              resolve();
            } catch (err) {
              reject(err);
            }
          })
        );
      }
      await Promise.all(promiseArray);
      response.status(200).send();
    } catch (err) {
      console.log(`(issue_share) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }
}

module.exports = IssueController;
