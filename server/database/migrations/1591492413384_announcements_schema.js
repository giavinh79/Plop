'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AnnouncementsSchema extends Schema {
  up () {
    this.table('announcements', (table) => {
      // alter table
    })
  }

  down () {
    this.table('announcements', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AnnouncementsSchema
