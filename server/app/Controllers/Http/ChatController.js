'use strict';

const Database = use('Database');
const Encryption = use('Encryption');

class ChatController {
  async get({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = Encryption.decrypt(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');
      // need to check each user's avatars in chat comments and update the tables first
      // maybe have map structure for 'caching'
      let chats = await Database.from('chats').where('room_id', decryptedRoomId).select('*');
      let promisesArray = [];
      let updatedChats = []; // adding avatar attribute and determining if message belongs to current user
      let userAvatarMap = new Map();
      chats.map((item) => {
        promisesArray.push(
          new Promise(async (resolve, reject) => {
            try {
              item.userMessage = item.user === user.email;
              if (userAvatarMap.has(item.user_id)) {
                item.avatar = userAvatarMap.get(item.user_id);
              } else {
                let [avatar] = await Database.from('users').where('id', item.user_id).select('avatar');
                item.avatar = avatar.avatar;
                userAvatarMap.set(item.user_id, avatar.avatar);
              }
              resolve(item);
            } catch (err) {
              reject(err);
            }
          })
        );
      });
      chats = await Promise.all(promisesArray);

      if (!chats || chats.length === 0) {
        response.status(200).json([]);
      } else {
        response.status(200).json(chats);
      }
    } catch (err) {
      console.log(`(chat_get) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async getTeam({ auth, request, response }) {
    try {
    } catch (err) {
      console.log(`(issue_getTeam) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }
}

module.exports = ChatController;
