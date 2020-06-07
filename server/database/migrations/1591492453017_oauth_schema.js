'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OauthSchema extends Schema {
  up () {
    this.create('oauths', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('oauths')
  }
}

module.exports = OauthSchema
