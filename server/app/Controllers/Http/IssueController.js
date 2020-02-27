'use strict';

const Database = use('Database');
const Env = use('Env');
const Issue = use('App/Models/Issue');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: Env.get('CLOUDINARY_CLOUD'),
  api_key: Env.get('CLOUDINARY_KEY'),
  api_secret: Env.get('CLOUDINARY_SECRET'),
});

class IssueController {
  async create({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const { title, shortDescription, description, assignee, tag, priority, status, dragger } = request.body;

      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', request.cookie('room'));
      if (result.length === 0) throw new Error('User not in this room');

      const issue = new Issue();
      if (dragger) {
        // Enters here if images were attached to the issue
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
          room: request.cookie('room'),
          shortDescription,
          description,
          assignee,
          creator: user.email,
          priority: priority || 0,
          status: status || 0,
          image: JSON.stringify(imageIdArray),
          tag: JSON.stringify(tag),
        });
        await issue.save();
        response.status(200).json({
          status: status === 0 ? 'backlog' : 'dashboard',
        });
      } else {
        issue.fill({
          title,
          room: request.cookie('room'),
          shortDescription,
          description,
          assignee,
          creator: user.email,
          priority: priority || 0,
          status: status || 0,
          tag: JSON.stringify(tag),
        });
        await issue.save();
        response.status(200).json({
          status: status === 0 ? 'backlog' : 'dashboard',
        });
      }
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
        .where('room_id', request.cookie('room'));

      if (result.length === 0) throw new Error('User not in this room');

      // Cloudinary image deletion code
      const issue = await Database.table('issues')
        .where('id', request.params.id)
        .select('image');
      const imagePromises = [];
      for (let item of JSON.parse(issue[0].image)) {
        imagePromises.push(
          new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(item, (error, result) => {
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

  async teamGet({ auth, request, response }) {
    try {
      // type of issue trying to be requested given by request.params.status (0 - backlog, 1 - active, 2 - )
      const user = await auth.getUser();
      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', request.cookie('room'));
      if (result.length === 0) throw new Error('User not in this room');

      if (request.params.status === '0') {
        const issues = await Database.table('issues')
          .select('*')
          .where({
            room: request.cookie('room'),
            status: 0,
          });
        response.status(200).send(issues);
      } else {
        const activeItems = await Database.table('issues')
          .select('*')
          .where({
            room: request.cookie('room'),
            status: 1,
          });
        const progressItems = await Database.table('issues')
          .select('*')
          .where({
            room: request.cookie('room'),
            status: 2,
          });
        const completedItems = await Database.table('issues')
          .select('*')
          .where({
            room: request.cookie('room'),
            status: 3,
          });

        response.status(200).send({
          activeItems,
          progressItems,
          completedItems,
        });
      }
    } catch (err) {
      console.log(`(issue_teamget) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async userGet({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', request.cookie('room'));
      if (result.length === 0) throw new Error('User not in this room');

      if (request.params.status === 0) {
        const issues = await Database.table('issues')
          .select('*')
          .where({
            room: request.cookie('room'),
            assignee: user.email,
          });
        response.status(200).send(issues);
      } else {
        const activeItems = await Database.table('issues')
          .select('*')
          .where({
            room: request.cookie('room'),
            status: 1,
            assignee: user.email,
          });
        const progressItems = await Database.table('issues')
          .select('*')
          .where({
            room: request.cookie('room'),
            status: 2,
            assignee: user.email,
          });
        const completedItems = await Database.table('issues')
          .select('*')
          .where({
            room: request.cookie('room'),
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
      console.log(`(issue_userget) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async update({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', request.cookie('room'));
      if (result.length === 0) throw new Error('User not in this room');
      const { title, shortDescription, description, assignee, tag, priority, status, dragger } = request.body;
      console.log(request.body);
      console.log(request.body.id);
      console.log(request.cookie('room'));
      await Database.table('issues')
        .where({ room: request.cookie('room'), id: request.body.id })
        .update({
          title,
          shortDescription,
          description,
          assignee,
          tag: JSON.stringify(tag),
          priority,
          status,
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
      const result = await Database.from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', request.cookie('room'));
      if (result.length === 0) throw new Error('User not in this room');

      await Database.table('issues')
        .where({ room: request.cookie('room'), id: request.body.id })
        .update({ status: request.body.status });
      response.status(200).send();
    } catch (err) {
      console.log(`(issue_update) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }
}

module.exports = IssueController;
