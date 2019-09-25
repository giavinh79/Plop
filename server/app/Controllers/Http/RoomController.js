'use strict'

const Encryption = use('Encryption')
const Database = use('Database')
const Room = use('App/Models/Room')

class RoomController {
  async get({ auth, response }) {
    try {
      let roomsInfo = [];
      const user = await auth.getUser()
      const rooms = await Database.table('user_rooms').select('room_id').where('user_id', user.id)

      for (let room of rooms) {
        const roomInfo = await Database.table('rooms').select('name', 'description').where('id', room.room_id)
        const roomObject = JSON.parse(JSON.stringify(roomInfo[0]))
        roomObject.id = room.room_id
        roomsInfo.push(roomObject)
      }
      response.status(200).json(roomsInfo)
    } catch (err) {
      console.log(`(room_get) ${new Date()} [User:${await auth.getUser().id}]: ${err}`)
      response.status(404).send()
    }
  }

  async info({ request, auth, response }) {
    try {
      const user = await auth.getUser()

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', request.cookie('room'))
      if (result.length === 0) throw new Error('User not in room')

      const roomInfo = await Database.table('rooms').select('*').where('id', request.cookie('room'))
      const decryptPass = Encryption.decrypt(roomInfo[0].password);
      const { name, description, id, maxMembers, adminApproval } = roomInfo[0];

      response.status(200).json({ name, description, decryptPass, id, maxMembers, private: roomInfo[0].private, adminApproval })
    } catch(err) {
      console.log(`(room_roomInfo) ${new Date()} [User:${await auth.getUser().id}]: ${err}`)
      response.status(404).send()
    }
  }

  async update({ auth, request, response }) {
    try {
      // This method promotes an issue from backlog to active
      // or progresses it from active -> in progress -> completed
      const user = await auth.getUser()
      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', response.cookie('roomId'))
      if (result.length === 0) throw new Error('User not in room')

    } catch(err) {
      console.log(`(room_update) ${new Date()} [User:${await auth.getUser().id}]: ${err}`)
      response.status(404).send()
    }
  }

  async create({ auth, request, response }) {
    try {
      const user = await auth.getUser()
      const { roomName, roomDescription, roomPassword } = request.body

      if (user.numTeams >= 3) {
        throw new Error('Team limit reached')
      }

      const room = new Room()
      room.fill({
        admin: user.id,
        name: roomName,
        description: roomDescription,
        password: Encryption.encrypt(roomPassword),
        maxMembers: 12,
        private: false,
        adminApproval: false,
        status: 0
      })

      // Use transactions to safely commit all required changes (if one fails, all get reverted)
      await Database.transaction(async (trx) => {
        await Database.table('users').where('id', user.id).update({ numTeams: user.numTeams + 1 })
        await room.save()
        await trx.table('user_rooms').insert({ user_id: user.id, room_id: room.id })
      })
      // await room.save()
      // await Database.table('user_rooms').insert({user_id: user.id, room_id: room.id })
      response.status(200).json({ id: room.id, name: roomName, description: roomDescription })

    } catch (err) {
      console.log(`(room_create) ${new Date()} [User:${await auth.getUser().id}]: ${err}`)
      response.status(404).send()
    }
  }

  async join({ auth, request, response }) {
    try {
      const user = await auth.getUser()
      const { roomId, roomPassword } = request.body

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', roomId)
      if (result.length !== 0) throw new Error('User already in room')

      result = await Database.from('rooms').select('password').where('id', roomId)
      if (Encryption.decrypt(result[0].password) !== roomPassword) throw new Error('No results')

      // Future - add check here for if admin approval == true. If it is false
      // then we have to add it to pending table and tell user via notification/email that their request
      // has been sent to the room admin and needs to be approved
      await Database.table('user_rooms').insert({ user_id: user.id, room_id: roomId })
      response.cookie('room', roomId)
      response.status(200).json({ id: roomId })

    } catch (err) {
      console.log(`(room_join) ${new Date()}: ${err}`)
      response.status(404).send()
    }
  }

  // Method to set current room on clientside (prevents client tampering to a degree)
  // With cookie extensions they can edit the httponly cookie however
  // We will confirm on every request that this user is a part of that room
  async session({ request, auth, response }) {
    try {
      const user = await auth.getUser()
      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', request.body.id)

      if (result.length === 0) throw new Error('Unauthorized Access')
      response.cookie('room', request.body.id)
      response.status(200).send()
    } catch (err) {
      console.log(`(room_session) ${new Date()}: ${err}`)
      response.status(404).send()
    }
  }
}

module.exports = RoomController
