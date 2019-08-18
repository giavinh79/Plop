'use strict'

const Hash = use('Hash')
const Database = use('Database')
const Room = use('App/Models/Room')

class RoomController {
    async get( { auth, response }) {
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
            console.log(`${new Date()} [User:${await auth.getUser().id}]: ${err}`)
            response.status(404).send()
        }
    }

    async create( { auth, request, response }) {
        try {
            const user = await auth.getUser()
            const { roomName, roomDescription, roomPassword } = request.body

            if (user.numTeams >= 3) {
                throw new Error('Team limit reached')
            }

            const room = new Room()
            room.fill( { 
                admin: user.id,
                name: roomName,
                description: roomDescription,
                password: roomPassword,
                maxMembers: 12,
                invite: true,
                adminApproval: false,
                status: 0
            })

            // Use transactions to safely commit all required changes (if one fails, all get reverted)
            await Database.transaction(async (trx) => {
                await Database.table('users').where('id', user.id).update({ numTeams: user.numTeams + 1 })
                await room.save()
                await trx.table('user_rooms').insert({user_id: user.id, room_id: room.id })
            })
            // await room.save()
            // await Database.table('user_rooms').insert({user_id: user.id, room_id: room.id })
            response.status(200).json({ id : room.id, password : roomPassword, name : roomName, description : roomDescription })

        } catch(err) {
            console.log(`${new Date()} [User:${await auth.getUser().id}]: ${err}`)
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

    // Method to set current room on clientside (prevents client tampering to a degree)
    // With cookie extensions they can edit the httponly cookie however
    // We will confirm on every request that this user is a part of that room
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
