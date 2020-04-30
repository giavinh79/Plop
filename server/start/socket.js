'use strict';

const Ws = use('Ws');
const Database = use('Database');
const Encryption = use('Encryption');
let userEmails = new Set();
let userCount = new Map();
let users = new Set();

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
    const [room] = await Database.from('rooms').where('websocketId', socket.topic.substring(5, socket.topic.length));
    const result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', room.id);
    if (result.length === 0) socket.close();
    console.log(`User connected to ${socket.topic} as ${user.email}`);

    const topic = Ws.getChannel('room:*').topic(socket.topic);
    userEmails.add(user.email);

    if (!users.has(socket.id)) {
      users.add(socket.id);
      if (!userCount.has(socket.topic)) {
        userCount.set(socket.topic, 1);
      } else {
        let count = userCount.get(socket.topic);
        userCount.set(socket.topic, count + 1);
        socket.broadcastToAll('message', { type: 0, count: count + 1, users: [...userEmails] });
      }
    }

    socket.on('message', async (data) => {
      let date = new Date();
      socket.broadcast('message', { ...data, user: user.email, read: false, date });
      if (data.type === 1) {
        await Database.table('chats').insert({
          user: user.email,
          user_id: user.id,
          room_id: Encryption.decrypt(request.cookie('room')),
          message: data.message,
          dateCreated: date,
        });
      }
    });

    socket.on('close', () => {
      console.log('user disconnected');
      userEmails.delete(user.email);
      users.delete(socket.id);
      let count = userCount.get(socket.topic);
      userCount.set(socket.topic, count - 1);
      topic.broadcast('message', { type: 0, count: userCount.get(socket.topic), users: [...userEmails] });
    });
  } catch (err) {
    console.log(`Socket Error ${err}`);
    socket.close();
  }
})
  .middleware(jwtMiddleware)
  .middleware(['auth']);
