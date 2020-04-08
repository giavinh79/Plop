'use strict';

const Ws = use('Ws');
let userCount = new Map();
let users = new Set();

/* Socket message properties
 * type - 0 (chat count), 1 - message
 *
 */
Ws.channel('room:*', ({ socket }) => {
  console.log('User connected with %s socket id', socket.id);
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

  socket.on('message', (data) => {
    console.log(data);
    console.log('new message');
    socket.broadcastToAll('message', data);
  });

  socket.on('close', () => {
    console.log('user disconnected');
    users.delete(socket.id);
    let count = userCount.get(socket.topic);
    userCount.set(socket.topic, count - 1);
    socket.broadcast('message', { type: 0, count: userCount.get(socket.topic) });
    socket.broadcast('message', 'skurtskurt');
    test();
  });
});
