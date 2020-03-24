'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments();
      table
        .string('email', 80)
        .notNullable()
        .unique();
      table.string('password', 60).notNullable();
      table.integer('status');
      table.integer('avatar');
      table.date('expiry');
      table.integer('numTeams');
      table.integer('darkMode');
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
