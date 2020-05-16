'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserRoomSchema extends Schema {
  up() {
    this.create('user_rooms', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('room_id').unsigned().references('id').inTable('rooms');
      table.string('role', 50);
      table.json('activity');
      table.json('notifications');
      table.string('last_checked_chat');
      table.integer('administration_level');
      // table.timestamps();
    });
  }

  down() {
    this.drop('user_rooms');
  }
}

module.exports = UserRoomSchema;
