import React, { useEffect, useState, useRef } from 'react';
import { Card, Icon, Input } from 'antd';
import { MembersOnlineWrapper } from './ChatStyles';
import ChatMessage from './ChatMessage';
import UserChatMessage from './UserChatMessage';
import InfiniteScroll from 'react-infinite-scroller';
import './Chat.css'; // to override ant design

export default function Chat({ chat, chatCount, chatMessages, setChatData }) {
  // const scrollRef = useRef([]);
  const inputRef = useRef();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    setUserCount(chatCount || 0);
    inputRef.current.focus();
  }, [chat, chatCount, chatMessages]);

  const loadMessages = () => {
    let chatDOM = [];

    for (let key = 0; key < chatMessages.length; key++) {
      if (chatMessages[key].userMessage) {
        chatDOM.push(
          <UserChatMessage
            message={chatMessages[key].message}
            key={key}
            date={chatMessages[key].dateCreated}
            id={key === chatMessages.length - 1 ? 'last-chat-element' : null}
          />
        );
      } else {
        chatDOM.push(
          <ChatMessage
            user={chatMessages[key].user}
            message={chatMessages[key].message}
            key={key}
            date={chatMessages[key].dateCreated}
            avatar={chatMessages[key].avatar}
            id={key === chatMessages.length - 1 ? 'last-chat-element' : null}
          />
        );
      }
    }

    let parent = React.createElement(
      'div',
      [],
      [
        chatDOM,
        // chatMessages.map((item, key) => {
        //   return item.userMessage ? (
        //     <UserChatMessage message={item.message} key={key} date={item.dateCreated} ref={scrollRef} />
        //   ) : (
        //     <ChatMessage
        //       user={item.user}
        //       message={item.message}
        //       key={key}
        //       date={item.dateCreated}
        //       avatar={item.avatar}
        //       ref={scrollRef}
        //     />
        //   );
        // }),
      ]
    );

    try {
      setTimeout(() => {
        document.getElementById('last-chat-element').scrollIntoView();
      }, 200);
    } catch (err) {
      console.log(err);
    }
    return parent;
  };

  const handleLoadMore = () => {
    // make more API calls
  };

  const handleMessage = () => {
    if (inputRef.current.input.value.trim().length > 0) {
      try {
        chat.emit('message', {
          type: 1,
          message: inputRef.current.input.value,
          avatar: localStorage.getItem('avatar') || null,
        });
        inputRef.current.state.value = '';
        setChatData((chatData) => {
          return {
            ...chatData,
            messages: [
              ...chatData.messages,
              { userMessage: true, message: inputRef.current.input.value, date: new Date() },
            ],
          };
        });
      } catch (err) {
        console.log(err);
      }
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
        }}
        className='chat-wrapper'
      >
        <InfiniteScroll
          // pageStart={1}
          loadMore={handleLoadMore}
          // hasMore={true || false}
          useWindow={false}
          isReverse={true}
        >
          {loadMessages()}
          {/* {chatMessages.map((item, key) => {
            return item.userMessage ? (
              <UserChatMessage message={item.message} key={key} date={item.dateCreated} ref={scrollRef} />
            ) : (
              <ChatMessage
                user={item.user}
                message={item.message}
                key={key}
                date={item.dateCreated}
                avatar={item.avatar}
                ref={scrollRef}
              />
            );
          })} */}
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
