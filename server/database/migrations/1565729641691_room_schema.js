'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomSchema extends Schema {
  up () {
    this.create('rooms', (table) => {
      table.increments()
      table.integer('admin').unsigned().references('id').inTable('users')
      table.string('name', [100])
      table.string('description', [250])
      table.string('password', 60).notNullable()
      table.integer('maxMembers')
      table.boolean('invite')
      table.timestamps()
    })
  }

  down () {
    this.drop('rooms')
  }
}

module.exports = RoomSchema
