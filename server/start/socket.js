'use strict';

const Ws = use('Ws');
const Database = use('Database');
const Encryption = use('Encryption');
let userCount = new Map();
let users = new Set();

const jwtMiddleware = async ({ request }, next) => {
  try {
    // console.log(request.headers());
    request.headers().authorization = `Bearer ${request.cookie('XSStoken')}`;
    // console.log(request.headers()['sec-websocket-key']);
    // console.log(Encryption.decrypt(request.headers()['sec-websocket-key']));
  } catch (err) {
    console.log(`${new Date()} : ${err.message}`);
  } finally {
    await next();
  }
};

/* Socket message properties:
 * type: 0 - members online count update, 1 - chat message, 2 - notification for user, 3 - comment made, 4 - new user joined, 5 - a member left
 */
Ws.channel('room:*', async ({ auth, socket, request }) => {
  try {
    let user = await auth.getUser();
    const result = await Database.from('user_rooms')
      .where('user_id', user.id)
      .where('room_id', Encryption.decrypt(request.cookie('room')));
    if (result.length === 0) socket.close();

    console.log(`User connected with socket id - ${socket.id}`);
    // console.log(socket.topic);

    if (!users.has(socket.id)) {
      users.add(socket.id);
      if (!userCount.has(socket.topic)) {
        userCount.set(socket.topic, 1);
      } else {
        let count = userCount.get(socket.topic);
        userCount.set(socket.topic, count + 1);
        socket.broadcastToAll('message', { type: 0, count: count + 1 });
      }
    }

    socket.on('message', async (data) => {
      socket.broadcastToAll('message', { ...data, user: user.email, read: false });
      if (data.type === 1) {
        await Database.table('chats').insert({ user: user.email, message: data.message, dateCreated: new Date() });
      }
    });

    socket.on('close', () => {
      console.log('user disconnected');
      users.delete(socket.id);
      let count = userCount.get(socket.topic);
      userCount.set(socket.topic, count - 1);
      socket.broadcast('message', { type: 0, count: userCount.get(socket.topic) });
    });
  } catch (err) {
    console.log('wtf');
    socket.close();
  }
})
  .middleware(jwtMiddleware)
  .middleware(['auth']);
