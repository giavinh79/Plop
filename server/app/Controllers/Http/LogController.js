'use strict';

const Database = use('Database');
const Hashids = require('hashids/cjs');
const hashids = new Hashids('', 9);

class LogController {
  async get({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const logs = await Database.select('*').from('logs').where('room_id', decryptedRoomId);

      if (logs.length === 0) {
        response.status(200).json([]);
      } else {
        response.status(200).json(logs);
      }
    } catch (err) {
      console.log(`(log_get) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }
}

module.exports = LogController;
