'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route.post('/signup', ({ request, response}) => {
    const { email, password, remember } = request.body
    console.log(`Email - ${email}, Password - ${password}, Remember - ${remember}`)
    response.send('success')
})

Route.put('/issue', 'IssueController.add')