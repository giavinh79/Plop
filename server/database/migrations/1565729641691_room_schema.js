'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RoomSchema extends Schema {
  up() {
    this.create('rooms', table => {
      table.increments();
      table
        .integer('admin')
        .unsigned()
        .references('id')
        .inTable('users');
      table.string('name', [100]).notNullable();
      table.string('description', [300]).notNullable();
      table.string('password', 60).notNullable();
      table.string('repository', 100);
      table.integer('maxMembers');
      table.integer('status');
      table.integer('currentMembers');
      table.boolean('private');
      table.boolean('adminApproval');
      table.json('chat');
      table.timestamps();
    });
  }

  down() {
    this.drop('rooms');
  }
}

module.exports = RoomSchema;
