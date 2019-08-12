'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Hash = use('Hash')
const { validate } = use('Validator')

class UserController {
    async addNewUser( { request, response }){
        const rules = {
            email: 'required|email',
            password: 'required'
        }
        
        const validation = await validate(request.body, rules)
        if (validation.fails()) {
            response.status(404).send('Error')
        } else {
            const user = new User()
            const { email, password } = request.body
            user.email = email;
            user.password = password;

            try {
                await user.save()
                response.status(200).send('User created successfully')
            } catch (err) {
                console.log(`${new Date()}: ${err}`)
                response.status(404).send('Error')
            }
        }
    }

    async login( { request, auth, session, response }){
        const { email, password } = request.body
        try {
            const token = await auth.attempt(email, password)
            response.status(200).json(token)
        } catch (err) {
            console.log(`${new Date()}: ${err}`)
            response.status(404).send('Error')
        }
    }

    // Using JWT, so I am actually checking for token here
    async checkSession( { auth, response }){
        try {
            await auth.check()
            response.status(200).send()
        } catch (error) {
            response.status(404).send()
        }
    }

    // If using sessions
    // async logout( { auth }) {
    //     const apiToken = auth.getAuthHeader()
    //     try {
    //         await auth.authenticator('api').revokeTokens([apiToken], true)
    //     } catch {
    //     }
    // }
}

module.exports = UserController
