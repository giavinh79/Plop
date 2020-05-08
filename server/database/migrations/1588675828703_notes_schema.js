'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class NotesSchema extends Schema {
  up() {
    this.create('notes', (table) => {
      table.increments();
      table.integer('room_id').unsigned().references('id').inTable('rooms');
      table.string('title', [100]);
      table.string('description', [1000]);
      table.integer('last_modified_by').unsigned();
      // table.timestamps();
    });
  }

  down() {
    this.drop('notes');
  }
}

module.exports = NotesSchema;
