'use strict'

const Hash = use('Hash')
const Database = use('Database')
const Room = use('App/Models/Room')

class RoomController {
    async create( { auth, request, response }) {
        try {
            const user = await auth.getUser()
            const { roomName, roomDescription, roomPassword } = request.body
            console.log(roomName + ' ' + roomDescription + ' ' + roomPassword)
            const room = new Room()
            room.admin = user.id
            room.name = roomName
            room.description = roomDescription
            room.password = roomPassword
            room.maxMembers = 12
            room.invite = true
            console.log('hi')
            await room.save()
            console.log('hi')
            await Database.table('user_rooms').insert({user_id: user.id, room_id: room.id })
            console.log('hi')
            response.status(200).json({ id : room.id, password : roomPassword, name : roomName, description : roomDescription })

        } catch(err) {
            console.log(`${new Date()}: ${err}`)
            response.status(404).send()
        }
        
    }
}

module.exports = RoomController
