import React from 'react';
import { Avatar, Icon, Tooltip } from 'antd';
import { ChatBubble, ChatUser, IconWrapper } from './ChatStyles';
import moment from 'moment';

const ChatMessage = ({ avatar, date, id, user, message }) => {
  return (
    <div id={id} style={{ display: 'flex', marginTop: '1.7rem', paddingBottom: '1rem' }}>
      {avatar ? (
        <Avatar
          size='large'
          src={`/images/avatars/monster${avatar}.svg`}
          style={{ margin: '-0.4rem 1rem 0 0', minWidth: '40px' }}
        />
      ) : (
        <IconWrapper>
          <Icon type='user' style={{ fontSize: '1.3rem', color: 'white' }} />
        </IconWrapper>
      )}
      {/* </IconWrapper> */}
      <div style={{ display: 'flex', flexDirection: 'column', margin: '-1.7rem 0 0 0' }}>
        <ChatUser>{user}</ChatUser>
        <ChatBubble>
          {date ? <Tooltip title={moment(date).format('YYYY-MM-DD HH:mm:ss')}>{message}</Tooltip> : message}
        </ChatBubble>
      </div>
    </div>
  );
};

export default ChatMessage;
