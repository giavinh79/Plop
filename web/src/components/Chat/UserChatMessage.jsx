import React from 'react';
import { Tooltip } from 'antd';
import { UserChatBubble } from './ChatStyles';
import moment from 'moment';

const UserChatMessage = ({ id, date, message }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }} id={id}>
      <UserChatBubble>
        {date ? <Tooltip title={moment(date).format('YYYY-MM-DD HH:mm:ss')}>{message}</Tooltip> : message}
      </UserChatBubble>
    </div>
  );
};

export default UserChatMessage;
