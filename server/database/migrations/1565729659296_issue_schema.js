'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

// Priority true - major, false - minor
// Status 0 - backlog, 1 - active, 2 - in progress, 3 - completed
class IssueSchema extends Schema {
  up() {
    this.create('issues', table => {
      table.increments();
      table.integer('room').unsigned();
      table.string('title', 100);
      table.string('shortDescription', 100);
      table.string('description', 1000);
      table.boolean('priority');
      table.integer('status');
      table.string('assignee', 100);
      table.string('creator', 100);
      table.json('image');
      table.json('tag');
      table.json('comments');
      table.timestamps();
    });
  }

  down() {
    this.drop('issues');
  }
}

module.exports = IssueSchema;
