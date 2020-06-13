/* Contains socket channels room and room-notes */
'use strict';

const Ws = use('Ws');
const Database = use('Database');
const Hashids = require('hashids/cjs');
const hashids = new Hashids('', 9);
let usersInfo = new Set(); // info to send back to client side regarding a user
// let users = new Set(); // track users currently connected by their socket id

const jwtMiddleware = async ({ request }, next) => {
  try {
    request.headers().authorization = `Bearer ${request.cookie('XSStoken')}`;
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
      .where('room_id', hashids.decodeHex(request.cookie('room')));

    if (result.length === 0) socket.close();
    console.log(`User connected to ${socket.topic} as ${user.email}`);

    // after all requests, stop loading of chat!
    const topic = Ws.getChannel('room:*').topic(socket.topic);
    for (let item of usersInfo) {
      if (item.email === user.email) {
        usersInfo.delete(item);
      }
    }
    usersInfo.add({ email: user.email, role: result[0].role, avatar: user.avatar, topic: socket.topic });
    socket.broadcastToAll('message', {
      type: 0,
      users: [...usersInfo].filter((item) => {
        return item.topic === socket.topic;
      }),
    });

    socket.on('message', async (data) => {
      let date = new Date();
      socket.broadcast('message', { ...data, avatar: user.avatar, user: user.email, read: false, date });
      if (data.type === 1) {
        await Database.table('chats').insert({
          user: user.email,
          user_id: user.id,
          room_id: hashids.decodeHex(request.cookie('room')),
          message: data.message,
          dateCreated: date,
        });
      }
    });

    socket.on('close', () => {
      console.log(`User ${user.email} has disconnected`);
      for (let item of usersInfo) {
        if (item.email === user.email) {
          usersInfo.delete(item);
        }
      }

      try {
        topic.broadcastToAll('message', { type: 0, users: [...usersInfo] });
      } catch (err) {
        Ws.getChannel('room:*')
          .topic(socket.topic)
          .broadcastToAll('message', { type: 0, users: [...usersInfo] });
      }
    });
  } catch (err) {
    console.log(`Socket Error ${err}`);
    socket.close();
  }
})
  .middleware(jwtMiddleware)
  .middleware(['auth']);

Ws.channel('room-notes:*', async ({ auth, socket, request }) => {
  try {
    let user = await auth.getUser();
    const result = await Database.from('user_rooms')
      .where('user_id', user.id)
      .where('room_id', hashids.decodeHex(request.cookie('room')));

    if (result.length === 0) socket.close();

    socket.on('message', async (data) => {
      socket.broadcast('message', { ...data });
    });
  } catch (err) {
    console.log(`Socket Note Error ${err}`);
    socket.close();
  }
})
  .middleware(jwtMiddleware)
  .middleware(['auth']);
