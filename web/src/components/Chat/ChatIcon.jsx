import React from 'react';
import { Badge, Icon } from 'antd';
import Chat from './Chat';
import { ChatIconWrapper } from './ChatIconStyles';

export default function ChatIcon({ chat, chatCount, chatMessages, ws }) {
  return (
    <ChatIconWrapper
      overlay={<Chat chat={chat} chatCount={chatCount} chatMessages={chatMessages} ws={ws} />}
      placement='topRight'
      trigger={['click']}
    >
      <Badge count={1} dot style={{ margin: '0.7rem 1.2rem' }}>
        <Icon type='wechat' theme='filled' style={{ fontSize: '20px' }} />
      </Badge>
    </ChatIconWrapper>
  );
}
