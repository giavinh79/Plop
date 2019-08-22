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
const jwtMiddleware = async ({ request }, next) => {
  try {
    request.headers().authorization = `Bearer ${request.cookie('XSStoken')}`
  } catch (err) {
    console.log(`${new Date()} : ${err}`)
  } finally {
    await next()
  }
}

Route.on('/').render('welcome')

// Authentication
Route.post('/login', 'UserController.login')
Route.post('/signup', 'UserController.addNewUser')
Route.post('/session', 'UserController.checkSession').middleware(jwtMiddleware)
Route.post('/logout', 'UserController.logout')

// Teams/Rooms
Route.get('/getRoom', 'RoomController.get').middleware(jwtMiddleware)
Route.post('/createRoom', 'RoomController.create').middleware(jwtMiddleware)
Route.post('/sessionRoom', 'RoomController.session').middleware(jwtMiddleware)
Route.post('/joinRoom', 'RoomController.join').middleware(jwtMiddleware)
Route.delete('/room', 'RoomController.delete')

// Issues - begin setting up other endpoints like this (REST)
Route.get('/issue', 'IssueController.get').middleware(jwtMiddleware)
Route.post('/issue', 'IssueController.update').middleware(jwtMiddleware)
Route.put('/issue', 'IssueController.create').middleware(jwtMiddleware)
Route.delete('/issue', 'IssueController.delete').middleware(jwtMiddleware)
