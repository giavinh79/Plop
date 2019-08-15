'use strict'

const Hash = use('Hash')
const Database = use('Database')
const Room = use('App/Models/Room')

class RoomController {
    async create( { auth, request, response }) {
        try {
            const user = await auth.getUser()
            const { roomName, roomDescription, roomPassword } = request.body
            console.log(user)
            const room = new Room()
            room.fill( { 
                admin: user.id,
                name: roomName,
                description: roomDescription,
                password: roomPassword,
                maxMembers: 12,
                invite: true,
                adminApproval: false
            })
            await room.save()
            await Database.table('user_rooms').insert({user_id: user.id, room_id: room.id })
            response.status(200).json({ id : room.id, password : roomPassword, name : roomName, description : roomDescription })

        } catch(err) {
            console.log(`${new Date()}: ${err}`)
            response.status(404).send()
        }
    }

    async join ( { auth, request, response }) {
        try {
            const user = await auth.getUser()
            const { roomId, roomPassword } = request.body
            let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', roomId)
            if (result.length !== 0) throw new Error('User already in room') 

            result = await Database.from('rooms').where('id', roomId).where('password', roomPassword)
            result.length === 0 ? response.status(200).send('No results') :
            // Future - add check here for if admin approval == true. If it is false
            // then we have to add it to pending table and tell user via notification/email that their request
            // has been sent to the room admin and needs to be approved
            await Database.table('user_rooms').insert({user_id: user.id, room_id: result.id })
            response.cookie('room', result.id)
            response.status(200).json({ id: result.id })

        } catch (err) {
            console.log(`${new Date()}: ${err}`)
            response.status(404).send()
        }
    }

    // Use to set current room (prevents client tampering)
    async session({ request, auth, response}) {
        try {
            const user = await auth.getUser()
            let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id')
            if (result.length === 0) throw new Error('Unauthorized Access')
            response.cookie('room', request.body.id)
            response.status(200).send()
        } catch(err) {
            console.log(`${new Date()}: ${err}`)
            response.status(404).send()
        }
    }
}

module.exports = RoomController
