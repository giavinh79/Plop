'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

/*
 * 'type' column values
 * 0 - creating issue
 * 1 - updating issue
 * 2 - deleting issue
 * 3 - commenting on issues
 * 4 - updating notes
 * 5 - user edited team settings
 * 6 - user creating team
 * 7 - user joining team
 * 8 - user leaving team
 * 9 - user x kicked user y
 * 10 - user x banned user y
 * 11 - user x changed the administration tier of user y
 * 12 - user x unbanned user y (unused for now)
 */
class LogSchema extends Schema {
  up() {
    this.create('logs', (table) => {
      table.increments();
      table.integer('room_id').unsigned();
      table.integer('issue_id').unsigned();
      table.integer('type').unsigned();
      table.string('description', 200);
      table.string('object', 100);
      table.string('user', 80);
      table.string('user_affected', 80);
      table.string('date', 80);
    });
  }

  down() {
    this.drop('logs');
  }
}

module.exports = LogSchema;
