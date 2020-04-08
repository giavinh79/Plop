import React, { useEffect, useRef, useState } from 'react';
import { Card, Icon, Input } from 'antd';
import { MembersOnlineWrapper } from './ChatStyles';
import ChatMessage from './ChatMessage';
import UserChatMessage from './UserChatMessage';
import InfiniteScroll from 'react-infinite-scroller';
import './Chat.css'; // to override ant design

export default function Chat({ chat, chatCount, chatMessages, setChatData, ws }) {
  const inputRef = useRef();
  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    setUserCount(chatCount || 0);
  }, [chat, chatCount, chatMessages]);

  const handleLoadMore = () => {
    // make more API calls
  };

  const handleMessage = () => {
    if (inputRef.current.input.value.trim().length > 0) {
      chat.emit('message', {
        type: 1,
        message: inputRef.current.input.value,
        user: 'tester@gmail.com',
      });
      inputRef.current.state.value = '';
    }
  };

  return (
    <>
      <Card
        title={<span style={{ marginBottom: '-2rem', marginRight: '0.3rem', fontSize: '1.3rem' }}>Team Chat</span>}
        extra={<MembersOnlineWrapper>{userCount} online</MembersOnlineWrapper>}
        headStyle={{ backgroundColor: '#477084', color: 'white' }}
        style={{
          width: 500,
          maxHeight: 500,
          overflow: 'auto',
          boxShadow: '0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2)',
        }}
      >
        <InfiniteScroll
          pageStart={0}
          loadMore={handleLoadMore}
          hasMore={true || false}
          useWindow={false}
          style={{ minHeight: '15rem' }}
        >
          {/* <ChatMessage user='tester123@gmail.com' message='Hello everybody, make sure you finish your work!' />
          <ChatMessage user='tester1234@gmail.com' message='No' />
          <ChatMessage user='tester123@gmail.com' message=':(' />
          <ChatMessage user='tester123@gmail.com' message=':(' />
          <UserChatMessage message='Random words to tes' /> */}
          {chatMessages.map((item, key) => {
            return <ChatMessage user={item.user} message={item.message} key={key} />;
          })}
        </InfiniteScroll>
      </Card>
      <Input
        allowClear
        style={{ height: '2rem', width: '100%', marginTop: '-2rem', borderRadius: 0 }}
        placeholder='Write your message here'
        suffix={<Icon type='enter' style={{ cursor: 'pointer', color: 'rgba(0,0,0,.45)' }} onClick={handleMessage} />}
        className='chat-input'
        onPressEnter={handleMessage}
        ref={inputRef}
        disabled={chat == null}
      />
    </>
  );
}
