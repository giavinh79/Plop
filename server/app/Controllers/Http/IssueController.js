'use strict'

const Database = use('Database')
const Issue = use('App/Models/Issue')

class IssueController {
  async create({ auth, request, response }) {
    try {
      const user = await auth.getUser()
      const {
        title,
        shortDescription,
        description,
        assignee,
        tag,
        priority,
        status
      } = request.body

      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', request.cookie('room'))
      if (result.length === 0) throw new Error('User not in this room')

      const issue = new Issue()
      issue.fill({
        title,
        room: request.cookie('room'),
        shortDescription,
        description,
        assignee,
        creator: user.email,
        priority: priority | 0,
        status: status | 0,
        tag: JSON.stringify(tag)
      })
      await issue.save()
      response.status(200).json({
        status: status === 0 ? 'backlog' : 'dashboard'
      })
    } catch (err) {
      console.log(`(issue_create) ${new Date()}: ${err}`)
      response.status(404).send()
    }
  }

  async delete({ auth, request, response }) {
    // will need to add more logic for administration levels
    try {
      const user = await auth.getUser()
      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', request.cookie('room'))
      if (result.length === 0) throw new Error('User not in this room')

      const deletions = await Database.table('issues').where('id', request.params.id).delete()
      if (deletions == null)
        response.status(404).send()
      else
        response.status(200).send()
    } catch (err) {
      console.log(`(issue_delete) ${new Date()}: ${err}`)
      response.status(404).send()
    }
  }

  async teamGet({ auth, request, response }) {
    try {
      // type of issue trying to be requested given by request.params.status (0 - backlog, 1 - active, 2 - )
      const user = await auth.getUser()
      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', request.cookie('room'))
      if (result.length === 0) throw new Error('User not in this room')

      if (request.params.status === 0) {
        const issues = await Database.table('issues').select('*').where({
          room: request.cookie('room'),
          status: 0
        })
        response.status(200).send(issues)
      } else {
        const activeItems = await Database.table('issues').select('*').where({
          room: request.cookie('room'),
          status: 1
        })
        const progressItems = await Database.table('issues').select('*').where({
          room: request.cookie('room'),
          status: 2
        })
        const completedItems = await Database.table('issues').select('*').where({
          room: request.cookie('room'),
          status: 3
        })
        response.status(200).send({
          activeItems,
          progressItems,
          completedItems
        })
      }

    } catch (err) {
      console.log(`(issue_teamget) ${new Date()}: ${err}`)
      response.status(404).send()
    }
  }

  async userGet({ auth, request, response }) {
    try {
      const user = await auth.getUser()
      const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', request.cookie('room'))
      if (result.length === 0) throw new Error('User not in this room')

      if (request.params.status === 0) {
        const issues = await Database.table('issues').select('*').where({
          room: request.cookie('room'),
          assignee: user.email
        })
        response.status(200).send(issues)
      } else {
        const activeItems = await Database.table('issues').select('*').where({
          room: request.cookie('room'),
          status: 1,
          assignee: user.email
        })
        const progressItems = await Database.table('issues').select('*').where({
          room: request.cookie('room'),
          status: 2,
          assignee: user.email
        })
        const completedItems = await Database.table('issues').select('*').where({
          room: request.cookie('room'),
          status: 3,
          assignee: user.email
        })
        response.status(200).send({
          activeItems,
          progressItems,
          completedItems
        })
      }
    } catch (err) {
      console.log(`(issue_userget) ${new Date()}: ${err}`)
      response.status(404).send()
    }
  }
}

module.exports = IssueController
