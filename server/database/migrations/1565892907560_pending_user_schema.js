'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

// On joining a team, the database will check in the relevant team table whether or not they have enable admin approval
// on. If not, the user will be added in this table which the admin will see on client side and will have to approve
// in order for the user to be added to the user_room table where they are now able to look at the team's room.
class PendingUserSchema extends Schema {
  up () {
    this.create('pending_users', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('pending_users')
  }
}

module.exports = PendingUserSchema
