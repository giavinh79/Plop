import React from 'react';
import { Icon, Tooltip } from 'antd';
import { ChatBubble, ChatUser, IconWrapper } from './ChatStyles';

export default function ChatMessage({ avatar, user, date, message }) {
  return (
    <div style={{ display: 'flex', marginTop: '1.7rem', paddingBottom: '1rem' }}>
      <IconWrapper>
        <Icon type='user' style={{ fontSize: '1.3rem', color: 'white' }} />
      </IconWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', margin: '-1.7rem 0 0 0' }}>
        <ChatUser>{user}</ChatUser>
        <ChatBubble>{date ? <Tooltip title={date}>{message}</Tooltip> : message}</ChatBubble>
      </div>
    </div>
  );
}
