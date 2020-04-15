'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ChatSchema extends Schema {
  up() {
    this.create('chats', (table) => {
      table.increments();
      table.timestamps();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('room_id').unsigned().references('id').inTable('rooms');
      table.string('message', 500);
      table.string('user', 200);
      table.string('dateCreated');
      table.integer('type');
    });
  }

  down() {
    this.drop('chats');
  }
}

module.exports = ChatSchema;
