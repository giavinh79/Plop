'use strict';

const cloudinary = require('cloudinary');
const Database = use('Database');
const Encryption = use('Encryption');
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
  async isNewAssignee(user, assignee, oldAssignee) {
    if (oldAssignee) {
      return assignee && assignee.length > 0 && assignee !== user && oldAssignee !== assignee;
    } else {
      return assignee && assignee.length > 0 && assignee !== user;
    }
  }

  async handleNotification(type, payload) {
    // type denotes type of notification (ie. new issue assignee (1), updated issue assignee (2), comment (3)...etc)
    try {
      const { assignee, issue, issueId, sourceUser, roomId } = payload;
      if (type <= 2) {
        let [user_data] = await Database.from('users')
          .select('id')
          .where('email', assignee);
        let [data] = await Database.table('user_rooms')
          .where('user_id', user_data.id)
          .where('room_id', roomId)
          .select('notifications');
        data.notifications.push({ assignee, date: new Date(), issue, issueId, sourceUser, status: 0, type: 1 });
        await Database.table('user_rooms')
          .where('user_id', user_data.id)
          .where('room_id', roomId)
          .update('notifications', JSON.stringify(data.notifications));

        // Need to notify previous assignee that another user has been assigned the issue
        if (type === 2) {
          const { oldAssignee } = payload;
          if (oldAssignee != null) {
            const [idObj] = await Database.table('users')
              .select('id')
              .where('email', oldAssignee);

            let [data] = await Database.table('user_rooms')
              .where('user_id', idObj.id)
              .where('room_id', roomId)
              .select('notifications');
            data.notifications.push({ assignee, date: new Date(), issue, issueId, status: 0, type: 2 });

            await Database.table('user_rooms')
              .where('user_id', idObj.id)
              .where('room_id', roomId)
              .update('notifications', JSON.stringify(data.notifications));
          }
        }
      } else {
        let [user_data] = await Database.from('users')
          .select('id')
          .where('email', assignee);
        let [data] = await Database.table('user_rooms')
          .where('user_id', user_data.id)
          .where('room_id', roomId)
          .select('notifications');
        data.notifications.push({ assignee, date: new Date(), issue, issueId, sourceUser, status: 0, type: 3 });
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
      const { assignee, description, dragger, priority, status, shortDescription, tag, title } = request.body;
      const decryptedRoomId = Encryption.decrypt(request.cookie('room'));

      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);
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
      if (await this.isNewAssignee(user.email, assignee)) {
        this.handleNotification(1, {
          assignee,
          issue: title,
          issueId: issue.id,
          sourceUser: user.email,
          roomId: decryptedRoomId,
        });
      }

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
      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', Encryption.decrypt(request.cookie('room')));

      if (result.length === 0) throw new Error('User not in this room');

      // Cloudinary image deletion code
      const issue = await Database.table('issues')
        .where('id', request.params.id)
        .select('image');

      const imagePromises = [];
      // need to JSON.parse(issue[0].image) if mySQL

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

      const deletions = await Database.table('issues')
        .where('id', request.params.id)
        .delete();

      if (deletions == null) throw new Error('Issue could not be deleted as it was not found');
      else response.status(200).send();
    } catch (err) {
      console.log(`(issue_delete) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async getTeam({ auth, request, response }) {
    try {
      // type of issue trying to be requested given by request.params.status (0 - backlog, 1 - active, 2 - )
      const user = await auth.getUser();
      const decryptedRoomId = Encryption.decrypt(request.cookie('room'));

      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      if (request.params.status === '0') {
        const issues = await Database.table('issues')
          .select('*')
          .where({
            room: decryptedRoomId,
            status: 0,
          });
        response.status(200).send(issues);
      } else {
        const activeItems = await Database.table('issues')
          .select('*')
          .where({
            room: decryptedRoomId,
            status: 1,
          });
        const progressItems = await Database.table('issues')
          .select('*')
          .where({
            room: decryptedRoomId,
            status: 2,
          });
        const completedItems = await Database.table('issues')
          .select('*')
          .where({
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
      const decryptedRoomId = Encryption.decrypt(request.cookie('room'));

      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      if (request.params.status === 0) {
        const issues = await Database.table('issues')
          .select('*')
          .where({
            room: decryptedRoomId,
            assignee: user.email,
          });
        response.status(200).send(issues);
      } else {
        const activeItems = await Database.table('issues')
          .select('*')
          .where({
            room: decryptedRoomId,
            status: 1,
            assignee: user.email,
          });
        const progressItems = await Database.table('issues')
          .select('*')
          .where({
            room: decryptedRoomId,
            status: 2,
            assignee: user.email,
          });
        const completedItems = await Database.table('issues')
          .select('*')
          .where({
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
      const decryptedRoomId = Encryption.decrypt(request.cookie('room'));

      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const data = await Database.table('issues')
        .select('comments')
        .where('id', request.params.id);
      response.status(200).json(data[0].comments);
    } catch (err) {
      console.log(`(issue_getComments) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async setComments({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = Encryption.decrypt(request.cookie('room'));

      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);
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

      // Should just revamp so that comments include user IDs (?)
      let comments = await Database.from('issues')
        .select('comments')
        .where('id', request.body.id);

      let watchers = new Set();
      for (let item of comments[0].comments) {
        if (item.author !== user.email) {
          watchers.add(item.author);
        }
      }

      if (await this.isNewAssignee(data[0].assignee, user.email)) watchers.add(data[0].assignee);
      if (await this.isNewAssignee(data[0].creator, user.email)) watchers.add(data[0].creator);

      for (let watcher of watchers) {
        this.handleNotification(3, {
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
      const decryptedRoomId = Encryption.decrypt(request.cookie('room'));

      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');
      const { title, shortDescription, description, assignee, tag, priority, status, dragger } = request.body;

      // Check here if assignee in DB is different or null for notifications
      let [dataAssignee] = await Database.table('issues')
        .select('assignee')
        .where('id', request.body.id);

      if (await this.isNewAssignee(user.email, assignee, dataAssignee.assignee)) {
        this.handleNotification(2, {
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
        const imageData = await Database.table('issues')
          .select('image')
          .where('id', request.body.id);

        const previousImages = dragger.reduce((accumulator, item) => {
          if (item.id != null) {
            accumulator.push(item.id);
            imageIdArray.push({ id: item.id, url: item.url });
          }
          return accumulator;
        }, []);

        let imagesToDelete = [];
        if (imageData[0].image && Array.isArray(imageData[0].image)) {
          imagesToDelete = imageData[0].image.filter(item => {
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
            assignee,
            tag: JSON.stringify(tag),
            image: JSON.stringify(imageIdArray),
            priority,
          });
      } else {
        await Database.table('issues')
          .where({ room: decryptedRoomId, id: request.body.id })
          .update({
            title,
            shortDescription,
            description,
            assignee,
            tag: JSON.stringify(tag),
            priority,
          });
      }
      response.status(200).send();
    } catch (err) {
      console.log(`(issue_update) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async updateProgress({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = Encryption.decrypt(request.cookie('room'));

      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      await Database.table('issues')
        .where({ room: decryptedRoomId, id: request.body.id })
        .update({ status: request.body.status });
      response.status(200).send();
    } catch (err) {
      console.log(`(issue_updateProgress) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }
}

module.exports = IssueController;
