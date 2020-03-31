'use strict';

const Ws = use('Ws');

Ws.channel('chat', ({ socket }) => {
  console.log('user joined with %s socket id', socket.id);
});
