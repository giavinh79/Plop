'use strict';

const Env = use('Env');
const Encryption = use('Encryption');
const Hashids = require('hashids/cjs');
const hashids = new Hashids('', 9);
const Database = use('Database');
const Room = use('App/Models/Room');

class RoomController {
  async get({ auth, response }) {
    try {
      let roomsInfo = [];
      const user = await auth.getUser();
      const rooms = await Database.table('user_rooms').select('room_id').where('user_id', user.id);

      for (let room of rooms) {
        const roomInfo = await Database.table('rooms')
          .select('name', 'description', 'currentMembers')
          .where('id', room.room_id);
        const roomObject = JSON.parse(JSON.stringify(roomInfo[0]));
        const [notificationData] = await Database.table('user_rooms')
          .select('notifications')
          .where({ user_id: user.id, room_id: room.room_id });
        roomObject.id = hashids.encodeHex(room.room_id.toString());
        roomObject.notifications = notificationData.notifications.filter((item) => item.status === 0).length;
        roomsInfo.push(roomObject);
      }
      response.status(200).json(roomsInfo);
    } catch (err) {
      console.log(`(room_get) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async getAssignees({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');

      let assignees = await Database.select('user_id').from('user_rooms').where('room_id', decryptedRoomId);

      let assigneesEmails = [];
      for (let assignee of assignees) {
        let emails = await Database.select('email').from('users').where('id', assignee.user_id);
        assigneesEmails.push(emails[0].email);
      }

      response.status(200).json(assigneesEmails);
    } catch (err) {
      console.log(`(room_getAssignees) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async getMembers({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let membersPayload = [];
      let count = 1;

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');

      let members = await Database.select('user_id', 'role', 'administration_level')
        .from('user_rooms')
        .where('room_id', decryptedRoomId);

      for (let member of members) {
        let [data] = await Database.select('*').from('users').where('id', member.user_id);

        membersPayload.push({
          key: count,
          id: member.user_id,
          member: data.email,
          role: member.role || 'N/A',
          administration: member.administration_level,
          date: data.created_at,
        });
        count++;
      }

      response.status(200).json(membersPayload);
    } catch (err) {
      console.log(`(room_getMembers) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async getNotifications({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');

      let [data] = await Database.select('notifications')
        .from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);

      response.status(200).json(data.notifications);
    } catch (err) {
      console.log(`(room_getNotifications) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async getRepository({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');

      let [repository] = await Database.select('repository').from('rooms').where('id', decryptedRoomId);
      response.status(200).json(repository);
    } catch (err) {
      console.log(`(room_getRepository) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async getRoomAdminTier({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');

      let [data] = await Database.select('administration_level')
        .from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);

      response.status(200).json({ administration_level: data.administration_level, user: user.email });
    } catch (err) {
      console.log(`(room_getRoomAdminTier) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async updateUserRoomTier({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');
      if (result[0].administration_level < 4)
        throw new Error('User does not have sufficient privileges to update admin tiers');

      const { name, id, tier } = request.body;
      if (tier > result[0].administration_level || tier >= 6 || id === user.id)
        throw new Error(`This privilege tier cannot be given to ${name} by ${user.email}`);

      await Database.transaction(async (trx) => {
        let [data] = await trx
          .select('administration_level')
          .from('user_rooms')
          .where('user_id', id)
          .where('room_id', decryptedRoomId);

        if (data.administration_level > result[0].administration_level) {
          throw new Error(`Cannot modify privilege tiers of users higher ranked`);
        }

        await trx
          .table('user_rooms')
          .where('user_id', id)
          .where('room_id', decryptedRoomId)
          .update({ administration_level: tier });
        await trx.table('logs').insert({
          room_id: decryptedRoomId,
          description: `${user.email} updated the administration tier of `,
          object: name,
          date: new Date().toString(),
          type: 11,
        });
      });

      response.status(200).send();
    } catch (err) {
      console.log(`(room_updateRoomAdminTier) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async removeMember({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');
      if (result[0].administration_level < 4) throw new Error('User does not have sufficient privileges');

      let userToKick = request.params.id;
      let { name, type } = request.body;
      await Database.transaction(async (trx) => {
        let [userToBeKicked] = await trx
          .table('user_rooms')
          .where({ user_id: userToKick, room_id: decryptedRoomId })
          .select('administration_level');
        if (userToBeKicked.administration_level > result[0].administration_level)
          throw new Error('Cannot remove user with higher privileges');

        if (type === 1) {
          await trx.table('user_rooms').where({ user_id: userToKick, room_id: decryptedRoomId }).delete();
          let [data] = await trx.table('rooms').select('ban_list', 'currentMembers').where({ id: decryptedRoomId });
          await trx
            .table('rooms')
            .where({ id: decryptedRoomId })
            .update({
              ban_list: JSON.stringify([...data.ban_list, { name, id: request.params.id }]),
              currentMembers: data.currentMembers - 1,
            });
          await trx.table('logs').insert({
            room_id: decryptedRoomId,
            description: `${user.email} banned ${name} from the `,
            object: 'team',
            date: new Date().toString(),
            type: 10,
          });
        } else {
          await trx.table('user_rooms').where({ user_id: userToKick, room_id: decryptedRoomId }).delete();
          let [data] = await trx.table('rooms').select('currentMembers').where({ id: decryptedRoomId });
          await trx
            .table('rooms')
            .where({ id: decryptedRoomId })
            .update({
              currentMembers: data.currentMembers - 1,
            });
          await trx.table('logs').insert({
            room_id: decryptedRoomId,
            description: `${user.email} kicked ${name} out of the `,
            object: 'team',
            date: new Date().toString(),
            type: 9,
          });
        }
      });

      response.status(200).send();
    } catch (err) {
      console.log(`(room_removeMember) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async getBanList({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');
      if (result[0].administration_level < 4)
        throw new Error('User does not have sufficient privileges to view this page');

      let [data] = await Database.table('rooms').select('ban_list').where({ id: decryptedRoomId });
      response.status(200).json(data.ban_list);
    } catch (err) {
      console.log(`(room_getBanList) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async updateBanList({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');
      if (result[0].administration_level < 4)
        throw new Error('User does not have sufficient privileges to update ban list');

      const { id } = request.body;

      await Database.transaction(async (trx) => {
        let [data] = await trx.table('rooms').select('ban_list').where({ id: decryptedRoomId });
        await trx
          .table('rooms')
          .where({ id: decryptedRoomId })
          .update({
            ban_list: JSON.stringify(data.ban_list.filter((item) => item.id !== id)),
          });
      });
      response.status(200).send();
    } catch (err) {
      console.log(`(room_updateBanList) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async updateNotifications({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');

      const { notifications } = request.body; // notifications read by user on FE
      let [data] = await Database.select('notifications')
        .from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);

      data.notifications = data.notifications.map((item) => {
        // As long as date of item in DB is less or equal recency to newest item read by user, we can change it
        if (item.status === 0 && item.date <= notifications[notifications.length - 1].date) {
          item.status = 1;
        }
        return item;
      });

      await Database.table('user_rooms')
        .update('notifications', JSON.stringify(data.notifications))
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);

      response.status(200).send();
    } catch (err) {
      console.log(`(room_updateNotifications) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async clearNotifications({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');

      const { notifications } = request.body; // notifications user wishes to clear

      let [data] = await Database.select('notifications')
        .from('user_rooms')
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);

      // should instead have an id for every notification generated serverside to make this easier
      data.notifications = data.notifications.filter((item) => {
        for (let notification of notifications) {
          if (notification.notificationId === item.notificationId) {
            return false;
          }
        }
        return true;
      });

      await Database.table('user_rooms')
        .update('notifications', JSON.stringify(data.notifications))
        .where('user_id', user.id)
        .where('room_id', decryptedRoomId);

      response.status(200).send();
    } catch (err) {
      console.log(`(room_clearNotifications) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async info({ request, auth, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');
      if (result[0].administration_level < 3)
        throw new Error('User does not have sufficient privileges to view settings');

      const roomInfo = await Database.table('rooms').select('*').where('id', decryptedRoomId);
      const decryptPass = Encryption.decrypt(roomInfo[0].password);
      const { name, description, default_admin_tier, maxMembers, adminApproval, repository } = roomInfo[0];
      const id = hashids.encodeHex(roomInfo[0].id.toString());

      response.status(200).json({
        name,
        description,
        decryptPass,
        id,
        maxMembers,
        private: roomInfo[0].private,
        adminApproval,
        default_admin_tier,
        repository,
      });
    } catch (err) {
      console.log(`(room_roomInfo) ${new Date()} [User:${await auth.getUser().id}]: ${err.message}`);
      response.status(404).send();
    }
  }

  async update({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));
      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);

      if (result.length === 0) throw new Error('User not in room');
      if (result[0].administration_level < 4)
        throw new Error('User does not have sufficient privileges to edit settings');

      if (result[0].administration_level < 5) {
        throw new Error('User does not have sufficient privileges to update team settings');
      }
      // let data = await Database.table('rooms').select('admin').where('id', decryptedRoomId);
      // if (data[0].admin !== user.id) {
      //   throw new Error('User changing room settings must be the owner');
      // }

      // Cannot destructure private as it is a keyword
      let { name, description, decryptPass, maxMembers, adminApproval, default_admin_tier, repository } = request.body;
      await Database.transaction(async (trx) => {
        await trx
          .table('rooms')
          .where('id', decryptedRoomId)
          .update({
            name: name,
            description: description,
            password: Encryption.encrypt(decryptPass),
            maxMembers: maxMembers,
            private: request.body.private,
            adminApproval: adminApproval,
            default_admin_tier: default_admin_tier,
            repository: repository,
          });

        await trx.table('logs').insert({
          room_id: decryptedRoomId,
          description: `${user.email} edited the `,
          object: 'team settings',
          date: new Date().toString(),
          type: 5,
        });
      });

      response.status(200).send();
    } catch (err) {
      console.log(`(room_update) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async create({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const { roomName, roomDescription, roomPassword } = request.body;

      if (user.numTeams >= 3) {
        throw new Error('Team limit reached');
      }

      const room = new Room();
      room.fill({
        admin: user.id,
        name: roomName,
        description: roomDescription,
        password: Encryption.encrypt(roomPassword),
        default_admin_tier: 3,
        currentMembers: 1,
        maxMembers: 12,
        private: false,
        adminApproval: false,
        status: 0,
        chat: JSON.stringify([]),
        ban_list: JSON.stringify([]),
      });

      // Use transactions to safely commit all required changes (if one fails, all get reverted)
      await Database.transaction(async (trx) => {
        await trx
          .table('users')
          .where('id', user.id)
          .update({ numTeams: user.numTeams + 1 });
        await room.save();
        await trx.table('user_rooms').insert({
          user_id: user.id,
          room_id: room.id,
          role: null,
          administration_level: 6,
          notifications: JSON.stringify([]),
        });
        await trx.table('logs').insert({
          room_id: room.id,
          description: `${user.email} created team `,
          object: room.name,
          date: new Date().toString(),
          type: 6,
        });
        await trx.table('notes').insert({
          room_id: room.id,
          notes_layout: JSON.stringify([]),
          notes: JSON.stringify([]),
          last_modified: new Date().toString(),
          last_modified_by: 0,
        });
      });

      const encryptedRoomId = hashids.encodeHex(room.id.toString());

      emailQueue.sendEmailMessage({
        subject: 'Team Credentials',
        body: `<p>Your team ID is <strong>${encryptedRoomId}</strong> and your password is <strong>${roomPassword}</strong>.</p>`,
        to: ['user.email']
      })

      response.status(200).json({ id: encryptedRoomId, name: roomName, description: roomDescription });
    } catch (err) {
      console.log(`(room_create) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async join({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      let { roomId, roomPassword } = request.body;
      const decryptedRoomId = hashids.decodeHex(roomId);

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length !== 0) throw new Error('User already in room');

      result = await Database.from('rooms')
        .select('password', 'adminApproval', 'private', 'ban_list')
        .where('id', decryptedRoomId);

      if (Encryption.decrypt(result[0].password) !== roomPassword) throw new Error('Wrong password');
      if (result[0].private) throw new Error('Private room');
      for (let bannedUser of result[0].ban_list) {
        if (bannedUser.id === user.id.toString()) {
          throw new Error('User is banned from this team');
        }
      }

      // if (result[0].adminApproval) throw
      // Future - add check here for if admin approval == true. If it is true
      // then we have to add it to pending table and tell user via notification/email that their request
      // has been sent to the room admin and needs to be approved

      await Database.table('users')
        .where('id', user.id)
        .update({ numTeams: user.numTeams + 1 });

      await Database.transaction(async (trx) => {
        const data = await trx
          .table('rooms')
          .select('currentMembers', 'default_admin_tier')
          .where('id', decryptedRoomId);

        await trx.table('user_rooms').insert({
          user_id: user.id,
          room_id: decryptedRoomId,
          role: null,
          administration_level: data[0].default_admin_tier,
          notifications: JSON.stringify([]),
        });

        await trx
          .table('rooms')
          .where('id', decryptedRoomId)
          .update({
            currentMembers: data[0].currentMembers + 1,
          });
        await trx.table('logs').insert({
          room_id: decryptedRoomId,
          description: `${user.email} joined the `,
          object: 'team',
          date: new Date().toString(),
          type: 7,
        });
      });

      response.cookie(
        'room',
        roomId,
        Env.get('DEVELOPMENT') === 'true'
          ? {
            httpOnly: true,
            path: '/',
          }
          : {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
          }
      );

      response.status(200).json({ id: roomId, name: result[0].name });
    } catch (err) {
      console.log(`(room_join) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async leave({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const { teamId } = request.body;
      const decryptedRoomId = hashids.decodeHex(teamId);

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');

      let data = await Database.table('rooms').select('admin').where('id', decryptedRoomId);

      if (data[0].admin === user.id) {
        throw new Error('Must delete room if user is the owner');
      }

      await Database.transaction(async (trx) => {
        await trx.table('logs').insert({
          room_id: decryptedRoomId,
          description: `${user.email} left the `,
          object: 'team',
          date: new Date().toString(),
          type: 8,
        });

        let data = await trx.table('rooms').select('currentMembers').where('id', decryptedRoomId);

        await trx
          .table('rooms')
          .where('id', decryptedRoomId)
          .update({
            currentMembers: Math.max(1, data[0].currentMembers - 1),
          });

        await trx
          .table('users')
          .where('id', user.id)
          .update({ numTeams: user.numTeams - 1 });

        await trx.table('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId).delete();
      });
      response.status(200).send();
    } catch (err) {
      console.log(`(room_leave) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async delete({ request, auth, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));
      const { email, password } = request.body;

      await auth.attempt(email, password);

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in room');

      let data = await Database.table('rooms').select('admin').where('id', decryptedRoomId);

      if (data[0].admin !== user.id) {
        throw new Error('Can only delete room if user is owner');
      }

      await Database.transaction(async (trx) => {
        /*
         * in the future delete all logs and notes
         */

        await trx.table('logs').where('room_id', decryptedRoomId).delete();
        await trx.table('notes').where('room_id', decryptedRoomId).delete();
        await trx.table('chats').where('room_id', decryptedRoomId).delete();

        // Finding all members to reduce their numTeams value by 1
        let members = await trx.table('user_rooms').select('user_id').where('room_id', decryptedRoomId);

        for (let member of members) {
          let [data] = await trx.table('users').select('numTeams').where('id', member.user_id);

          await trx
            .table('users')
            .select('numTeams')
            .update('numTeams', Math.max(0, data.numTeams - 1));

          // Deleting user-room relationship
          await trx.table('user_rooms').where('user_id', member.user_id).where('room_id', decryptedRoomId).delete();
        }

        // Deleting all issues related to the room
        await trx.table('issues').where('room', decryptedRoomId).delete();

        // Finally deleting room
        await trx.table('rooms').where('id', decryptedRoomId).delete();
      });
      response.status(200).send();
    } catch (err) {
      console.log(`(room_delete) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  // Method to set current room on clientside (prevents client tampering to a degree)
  // We will confirm on every request that this user is a part of that room
  async session({ request, auth, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.body.id);
      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('Unauthorized Access');

      response.cookie(
        'room',
        request.body.id,
        Env.get('DEVELOPMENT') === 'true'
          ? {
            httpOnly: true,
            path: '/',
          }
          : {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
          }
      );
      response.status(200).send();
    } catch (err) {
      console.log(`(room_session) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }
}

module.exports = RoomController;
