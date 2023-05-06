import React, { useContext, useEffect, useRef, useState } from 'react';
import { Badge, Icon, Spin } from 'antd';
import Ws from '@adonisjs/websocket-client';

import Chat from './Chat';
import { WEB_SOCKET } from '../../constants';
import { subscribeToRoom } from '../../websockets/ws';
import { getLastReadChat, updateLastReadChat } from '../../utility/restCalls';

import { ChatIconWrapper } from './ChatIconStyles';
import { ThemeContext } from '../../colors/theme';

export default function ChatIcon() {
  const ws = useRef(Ws(WEB_SOCKET));

  const [theme] = useContext(ThemeContext);

  const [chat, setChat] = useState(null);
  const [chatNotification, setChatNotification] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatData, setChatData] = useState({
    messages: [],
    users: [],
  });

  const handleChatDialogAction = async () => {
    setChatNotification(false);
    try {
      await updateLastReadChat(new Date().toString());
    } catch (err) {}
  };

  useEffect(() => {
    subscribeToRoom(ws.current, setChat, setChatData, setChatLoading, setChatNotification); // connect to team's chat

    return (ws) => {
      try {
        ws.current.close();
      } catch (err) {}
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (chatData?.messages?.length > 0) {
        const mostRecentMessage = chatData.messages.slice(-1)[0];

        if (mostRecentMessage.userMessage) {
          return;
        }

        const mostRecentMessageDate = new Date(mostRecentMessage.dateCreated);

        const {
          data: { lastCheckedChat },
        } = await getLastReadChat();

        if (lastCheckedChat == null || new Date(lastCheckedChat).getTime() < mostRecentMessageDate.getTime()) {
          setChatNotification(true);
        }
      }
    })().catch((err) => {
      // if not session error unknown error ->
      // displaySimpleNotification();
    });
  }, [chatData]);

  return (
    <ChatIconWrapper
      overlay={
        <Chat chat={chat} chatUsers={chatData.users} chatMessages={chatData.messages} setChatData={setChatData} />
      }
      theme={theme}
      placement='topRight'
      trigger={['click']}
      disabled={chatLoading}
      onVisibleChange={handleChatDialogAction}
    >
      <Badge count={chatNotification ? '1' : '0'} dot style={{ margin: '0.7rem 1.2rem' }}>
        {chatLoading ? <Spin /> : <Icon type='wechat' theme='filled' style={{ fontSize: '20px' }} />}
      </Badge>
    </ChatIconWrapper>
  );
}
