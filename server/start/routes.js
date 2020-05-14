const Route = use('Route');

const jwtMiddleware = async ({ request }, next) => {
  try {
    request.headers().authorization = `Bearer ${request.cookie('XSStoken')}`;
  } catch (err) {
    console.log(`${new Date()} : ${err.message}`);
  } finally {
    await next();
  }
};

Route.on('/').render('welcome');

// Authentication
Route.post('/login', 'UserController.login');
Route.post('/signup', 'UserController.addNewUser');
Route.post('/session', 'UserController.checkSession').middleware(jwtMiddleware);
Route.post('/logout', 'UserController.logout').middleware(jwtMiddleware);

// User Info
Route.get('/user/info', 'UserController.getUserInfo').middleware(jwtMiddleware);
Route.get('/user/room/info', 'UserController.getUserRoomInfo').middleware(jwtMiddleware);
Route.post('/user/info', 'UserController.setUserInfo').middleware(jwtMiddleware);
Route.get('/avatar', 'UserController.getAvatar').middleware(jwtMiddleware);

// Teams/Rooms
Route.get('/room', 'RoomController.get').middleware(jwtMiddleware);
Route.get('/room/info', 'RoomController.info').middleware(jwtMiddleware);
Route.put('/room', 'RoomController.create').middleware(jwtMiddleware);
Route.post('/room', 'RoomController.update').middleware(jwtMiddleware);
Route.delete('/room', 'RoomController.delete').middleware(jwtMiddleware);

Route.post('/room/session', 'RoomController.session').middleware(jwtMiddleware);
Route.post('/member/room', 'RoomController.join').middleware(jwtMiddleware);
Route.delete('/member/room', 'RoomController.leave').middleware(jwtMiddleware); // user leaves room

Route.get('/assignees', 'RoomController.getAssignees').middleware(jwtMiddleware);
Route.get('/members', 'RoomController.getMembers').middleware(jwtMiddleware);
Route.get('/repository', 'RoomController.getRepository').middleware(jwtMiddleware);

Route.get('/notifications', 'RoomController.getNotifications').middleware(jwtMiddleware);
Route.post('/notifications', 'RoomController.updateNotifications').middleware(jwtMiddleware);
Route.delete('/notifications', 'RoomController.clearNotifications').middleware(jwtMiddleware);

// Team Administration
Route.get('/user/room/tier', 'RoomController.getRoomAdminTier').middleware(jwtMiddleware);
Route.post('/user/room/tier', 'RoomController.updateUserRoomTier').middleware(jwtMiddleware);

Route.get('/room/ban-list', 'RoomController.getBanList').middleware(jwtMiddleware);
Route.post('/room/ban-list', 'RoomController.updateBanList').middleware(jwtMiddleware);

Route.delete('/room/user/:id', 'RoomController.removeMember').middleware(jwtMiddleware); // ban or kick member depending on request data

// Issues - begin setting up other endpoints like this (REST)
Route.get('/issue/:id', 'IssueController.get').middleware(jwtMiddleware);
Route.post('/issue', 'IssueController.update').middleware(jwtMiddleware);
Route.put('/issue', 'IssueController.create').middleware(jwtMiddleware);
Route.delete('/issue/:id', 'IssueController.delete').middleware(jwtMiddleware);

Route.get('/issue/team/:status', 'IssueController.getTeam').middleware(jwtMiddleware);
Route.get('/issue/user/:status', 'IssueController.getUser').middleware(jwtMiddleware);
Route.post('/issue/progress', 'IssueController.updateProgress').middleware(jwtMiddleware);

Route.get('/comments/:id', 'IssueController.getComments').middleware(jwtMiddleware);
Route.post('/comment', 'IssueController.setComments').middleware(jwtMiddleware);
Route.post('/issue/share', 'IssueController.shareIssue').middleware(jwtMiddleware);

// Chat
Route.get('/chats', 'ChatController.get').middleware(jwtMiddleware);
Route.get('/chats/last-read', 'ChatController.getLastReadChat').middleware(jwtMiddleware);
Route.post('/chats/last-read', 'ChatController.updatelastReadChat').middleware(jwtMiddleware);

// Notes
Route.get('/notes', 'NoteController.get').middleware(jwtMiddleware);
Route.post('/notes', 'NoteController.update').middleware(jwtMiddleware);

// Logs
Route.get('/logs', 'LogController.get').middleware(jwtMiddleware);

// Images (unused currently)
// Route.put('/image', 'ImageController.create').middleware(jwtMiddleware);
// Route.get('/image/:id', 'ImageController.get').middleware(jwtMiddleware);
// Route.delete('/image/:id', 'ImageController.delete').middleware(jwtMiddleware);
