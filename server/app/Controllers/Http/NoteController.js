'use strict';

const Database = use('Database');
const Hashids = require('hashids/cjs');
const hashids = new Hashids('', 9);

class NoteController {
  async get({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const notes = await Database.select('*').from('notes').where('room_id', decryptedRoomId);

      if (notes.length === 0) {
        response.status(200).json([]);
      } else {
        console.log(notes);
      }

      response.status(200).json();
    } catch (err) {
      console.log(`(note_get) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async create({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const { notes, layout } = request.body;

      console.log(notes);
      console.log(layout);

      //   const notes = await Database.select('*').from('notes').where('room_id', decryptedRoomId);
      //   await Database.table('chats').insert({
      //     user: user.email,
      //     user_id: user.id,
      //     room_id: hashids.decodeHex(request.cookie('room')),
      //     message: data.message,
      //     dateCreated: date,
      //   });

      //   if (notes.length === 0) {
      //     response.status(200).json([]);
      //   } else {
      //     console.log(notes);
      //   }

      response.status(200).send();
    } catch (err) {
      console.log(`(note_get) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async update({ auth, request, response }) {
    try {
      const user = await auth.getUser();

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      response.status(200).json();
    } catch (err) {
      console.log(`(note_get) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async delete({ auth, request, response }) {
    try {
      const user = await auth.getUser();

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      response.status(200).json();
    } catch (err) {
      console.log(`(note_get) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }
}

module.exports = NoteController;
