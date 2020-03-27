import React from 'react';
import { Card, Icon } from 'antd';
import { MembersOnlineWrapper } from './ChatStyles';
import ChatMessage from './ChatMessage';
import UserChatMessage from './UserChatMessage';

export default function Chat() {
  return (
    <Card
      title={<span style={{ marginRight: '0.3rem', fontSize: '1.3rem' }}>Team Chat</span>}
      extra={<MembersOnlineWrapper>3 online</MembersOnlineWrapper>}
      headStyle={{ backgroundColor: '#477084', color: 'white' }}
      style={{
        width: 500,
        height: 500,
        boxShadow: '0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2)',
      }}
    >
      <ChatMessage user='tester123@gmail.com' message='Hello everybody, make sure you finish your work!' />
      <ChatMessage user='tester1234@gmail.com' message='No' />
      <ChatMessage user='tester123@gmail.com' message=':(' />
      <UserChatMessage message='Random words to tes' />
    </Card>
  );
}

const styles = {
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.2rem',
    height: '2.2rem',
    backgroundColor: '#79B7D4',
    // border: '1px solid #ccc',
    padding: '0.5rem',
    marginRight: '0.5rem',
    borderRadius: '50%',
  },
  text: {
    margin: '0 0.3rem 0 0',
  },
};
