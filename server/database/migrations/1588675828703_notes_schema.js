'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class NotesSchema extends Schema {
  up() {
    this.create('notes', (table) => {
      table.increments();
      table.json('notes'); // contains title, description
      table.json('notes_layout');
      table.integer('room_id').unsigned().references('id').inTable('rooms');
      table.string('last_modified');
    });
  }

  down() {
    this.drop('notes');
  }
}

module.exports = NotesSchema;
