import React, { useEffect, useRef, useState } from 'react';
import { Badge, Icon, Spin } from 'antd';
import Chat from './Chat';
import { ChatIconWrapper } from './ChatIconStyles';
import Ws from '@adonisjs/websocket-client';
import { WEB_SOCKET } from '../../constants';
import { subscribeToRoom } from '../../websockets/ws';

export default function ChatIcon() {
  const ws = useRef(Ws(WEB_SOCKET));
  const [chat, setChat] = useState(null);
  const [chatNotification, setChatNotification] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatData, setChatData] = useState({
    messages: [],
    count: 0,
    users: [],
  });

  useEffect(() => {
    subscribeToRoom(ws.current, chatData, setChat, setChatData, setChatLoading, setChatNotification); // connect to team's chat

    return () => {
      try {
        if (ws.current) ws.current.close();
      } catch (err) {
        console.log(err);
      }
    };
  }, []);

  return (
    <ChatIconWrapper
      overlay={
        <Chat
          chat={chat}
          chatCount={chatData.count}
          chatUsers={chatData.users}
          chatMessages={chatData.messages}
          setChatData={setChatData}
        />
      }
      placement='topRight'
      trigger={['click']}
      disabled={chatLoading ? true : false}
      onClick={() => setChatNotification(false)}
    >
      <Badge count={chatNotification ? '1' : '0'} dot style={{ margin: '0.7rem 1.2rem' }}>
        {chatLoading ? <Spin /> : <Icon type='wechat' theme='filled' style={{ fontSize: '20px' }} />}
      </Badge>
    </ChatIconWrapper>
  );
}
