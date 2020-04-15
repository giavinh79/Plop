import React from 'react';
import { Badge, Icon, Spin } from 'antd';
import Chat from './Chat';
import { ChatIconWrapper } from './ChatIconStyles';

export default function ChatIcon({
  chat,
  chatCount,
  chatLoading,
  chatMessages,
  chatNotification,
  setChatData,
  setChatNotification,
}) {
  return (
    <ChatIconWrapper
      overlay={<Chat chat={chat} chatCount={chatCount} chatMessages={chatMessages} setChatData={setChatData} />}
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
