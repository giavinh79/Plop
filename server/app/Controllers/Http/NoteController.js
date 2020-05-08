'use strict';

const { v4: uuidv4 } = require('uuid');
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
        response.status(200).json(notes[0]);
      }
    } catch (err) {
      console.log(`(note_get) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async update({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('User not in this room');

      const { notes, layout } = request.body;

      let updatedNotes = notes.map((note) => {
        note.id = uuidv4();
        return note;
      });

      await Database.transaction(async (trx) => {
        await trx.table('notes').update('notes_layout', JSON.stringify(layout));
        await trx.table('notes').update('notes', JSON.stringify(updatedNotes));
        // should also update date here, so that whenever I do another update, it crosschecks old update date and new one to see if someone edited it during the time
      });

      response.status(200).send();
    } catch (err) {
      console.log(`(note_update) ${new Date()}: ${err.message}`);
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
