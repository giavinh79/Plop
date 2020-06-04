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
        // array of type of issues to include in response
        const { filter } = request.body;
        console.log(request.body);
        if (filter) {
          let filterArray = JSON.parse(filter);
          console.log(filter);
          const filteredLogs = logs.filter((log) => {
            return filterArray.includes(log.type);
          });
          response.status(200).json(filteredLogs);
        } else {
          response.status(200).json(logs);
        }
      }
    } catch (err) {
      console.log(`(log_get) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async getLogsForGraph({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const logs = await Database.select('*').from('logs').where('room_id', decryptedRoomId);

      if (logs.length === 0) {
        response.status(200).json([]);
      } else {
        const filteredLogs = logs.filter((log) => {
          return log.type === 0 || log.type === 12 || log.type === 13;
        });
        response.status(200).json(filteredLogs);
      }
    } catch (err) {
      console.log(`(log_getLogsForGraph) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }
}

module.exports = LogController;
