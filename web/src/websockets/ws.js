import { getChat } from '../utility/restCalls';

/* Web-sockets for chat messages and notifications */
export const subscribeToRoom = (ws, setChat, setChatData, setChatLoading, setChatNotification) => {
  ws.connect(); // connect to the server

  ws.on('open', async () => {
    const chat = ws.subscribe(`room:${JSON.parse(localStorage.getItem('currentTeam')).id}`); // maybe if this is null do a call to get room ID
    setChat(chat);

    chat.on('ready', async () => {
      const { data: messages } = await getChat();

      const sortedMessages = messages.sort((item, itemTwo) => {
        return item.dateCreated <= itemTwo.dateCreated ? -1 : 1;
      });

      setChatData((chatData) => ({ ...chatData, messages: sortedMessages }));
      setChatLoading(false);
    });

    /* On socket message event handler
     * 0 - members online count update, 1 - chat message, 2 - notification for user, 3 - comment made, 4 - new user joined, 5 - member left
     */
    chat.on('message', (data) => {
      switch (data.type) {
        case 0:
          setChatData((chatData) => ({ ...chatData, users: data.users }));
          break;
        case 1:
          setChatNotification(true);
          setChatData((chatData) => ({ ...chatData, messages: [...chatData.messages, data] }));
          break;
        default:
          break;
      }
    });

    chat.on('error', (error) => {
      console.log(error);
    });
  });

  ws.on('close', () => {
    console.log('WS connection closed');
  });
};
