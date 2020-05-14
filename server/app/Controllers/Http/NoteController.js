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
      if (result[0].administration_level < 3) {
        throw new Error('User does not have sufficient privileges to update notes');
      }

      const { date, notes, layout } = request.body;

      let updatedNotes = notes.map((note) => {
        note.id = uuidv4();
        return note;
      });

      let [dateData] = await Database.table('notes')
        .select('last_modified', 'last_modified_by')
        .where('room_id', decryptedRoomId);

      if (date && parseInt(date) < parseInt(dateData.last_modified)) {
        throw new Error('ERROR_NEW_NOTE_CHANGES'); // someone has edited the notes since user received notes
      }

      await Database.transaction(async (trx) => {
        if (user.id !== dateData.last_modified_by) {
          await Database.table('logs').insert({
            room_id: decryptedRoomId,
            description: `${user.email} updated the `,
            object: 'team notes',
            date: new Date().toString(),
            type: 4,
          });
        }

        await trx
          .table('notes')
          .where('room_id', decryptedRoomId)
          .update({
            notes_layout: JSON.stringify(layout),
            notes: JSON.stringify(updatedNotes),
            last_modified: date,
            last_modified_by: user.id,
          });
      });

      response.status(200).send();
    } catch (err) {
      console.log(`(note_update) ${new Date()}: ${err.message}`);
      response.status(404).send(err.message);
    }
  }
}

module.exports = NoteController;
