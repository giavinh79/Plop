'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserRoomSchema extends Schema {
  up () {
    this.create('user_rooms', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users')
      table.integer('room_id').references('id').inTable('rooms')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_rooms')
  }
}

module.exports = UserRoomSchema
