import React from 'react';
import { Tooltip } from 'antd';
import { UserChatBubble } from './ChatStyles';

export default function UserChatMessage({ date, message }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
      <UserChatBubble>{date ? <Tooltip title={date}>{message}</Tooltip> : message}</UserChatBubble>
    </div>
  );
}
