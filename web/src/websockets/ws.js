import { getChat } from '../utility/restCalls';

export const subscribeToRoom = (ws, chatData, setChat, setChatData, setChatLoading, setChatNotification) => {
  ws.connect(); // connect to the server

  ws.on('open', () => {
    let chat = ws.subscribe(`room:${JSON.parse(localStorage.getItem('currentTeam')).ws_id}`);
    setChat(chat);

    chat.on('ready', async () => {
      let { data } = await getChat();
      let messages = [...chatData.messages, ...data];
      messages.sort((item, itemTwo) => {
        if (item.dateCreated <= itemTwo.dateCreated) {
          return -1;
        } else {
          return 1;
        }
      });
      setChatData((chatData) => {
        return { ...chatData, messages };
      });
      setChatLoading(false);
      // call lastCheckedChat endpoint, if the date is < most recent chat message, show red symbol
      // when user clicks chat, send a request to lastCheckedChat endpoint to refresh date and manually turn off state
    });

    /* On socket message event handler
     * 0 - members online count update, 1 - chat message, 2 - notification for user, 3 - comment made, 4 - new user joined, 5 - member left
     */
    chat.on('message', (data) => {
      switch (data.type) {
        case 0:
          setChatData((chatData) => {
            return { ...chatData, count: data.count, users: data.users };
          });
          break;
        case 1:
          setChatNotification(true);
          setChatData((chatData) => {
            return { ...chatData, messages: [...chatData.messages, data] };
          });
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
