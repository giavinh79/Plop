'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Hash = use('Hash')
const { validate } = use('Validator')

// Add new columns for user and room (temp) for potential upgrades in the future
// Example - level, expiry date
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
            user.fill({ email: email, password: password, numTeams: 0 })

            try {
                await user.save()
                response.status(200).send('User created successfully')
            } catch (err) {
                console.log(`${new Date()}: ${err}`)
                response.status(404).send('Error')
            }
        }
    }

    async login( { request, auth, response }){
        const { email, password } = request.body
        try {
            const jwt = await auth.attempt(email, password)
            // 14400 seconds = 4 hours
            // add secure attribute when deployed(?)
            const { token } = jwt;
            response.cookie('XSStoken', token, {
                httpOnly: true
            })
            response.status(200).send()
        } catch (err) {
            console.log(`${new Date()}: ${err}`)
            response.status(404).send('Error')
        }
    }

    // Using JWT, so I am actually checking token here
    async checkSession( { auth, response }){
        try {
            await auth.check()
            response.status(200).send()
        } catch (error) {
            response.status(404).send()
        }
    }

    // JWT stored in httpOnly token to prevent XSS and CSRF
    async logout({response}) {
        response.clearCookie('XSStoken')
    }
}

module.exports = UserController
