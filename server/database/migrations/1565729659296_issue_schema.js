'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IssueSchema extends Schema {
  up () {
    this.create('issues', (table) => {
      table.increments()
      table.integer('room_id').references('id').inTable('rooms')
      table.string('title', 100)
      table.string('shortDescription', 100)
      table.string('description', 1000)
      table.integer('priority')
      table.integer('status')
      table.string('assignee', 100)
      table.json('image')
      table.timestamps()
    })
  }

  down () {
    this.drop('issues')
  }
}

module.exports = IssueSchema
