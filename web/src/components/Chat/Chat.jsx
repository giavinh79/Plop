import React, { useEffect, useState, useRef } from 'react';
import { Card, Icon, Input, List } from 'antd';
import { MembersOnlineWrapper, MembersOnline } from './ChatStyles';
import ChatMessage from './ChatMessage';
import UserChatMessage from './UserChatMessage';
import InfiniteScroll from 'react-infinite-scroller';
import './Chat.css'; // to override ant design
import ChatMember from './ChatMember';

export default function Chat({ chat, chatMessages, chatUsers, setChatData }) {
  const [usersOnlineView, setUsersOnlineView] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    try {
      if (inputRef.current) inputRef.current.focus();
    } catch (err) {}
  }, [chat, chatMessages]);

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

    let parent = React.createElement('div', [], [chatDOM]);

    setTimeout(() => {
      if (document.getElementById('last-chat-element')) {
        document.getElementById('last-chat-element').scrollIntoView();
      }
    }, 200);

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
        title={
          <span style={{ marginBottom: '-2rem', marginRight: '0.3rem', fontSize: '1.3rem' }}>
            {usersOnlineView ? 'Online Users' : 'Team Chat'}
          </span>
        }
        extra={
          usersOnlineView ? (
            <div
              style={{ cursor: 'pointer', color: 'white', marginTop: '-20px' }}
              onClick={() => setUsersOnlineView(false)}
            >
              <Icon type='arrow-left' /> Back
            </div>
          ) : (
            <MembersOnlineWrapper onClick={() => setUsersOnlineView(true)}>
              <MembersOnline>Online Users: {Array.isArray(chatUsers) ? chatUsers.length : 0}</MembersOnline>
              <Icon
                type='info-circle'
                theme='filled'
                style={{
                  fontSize: '1.5rem',
                  top: '13px',
                  right: '13px',
                  color: 'white',
                  position: 'absolute',
                }}
              />
            </MembersOnlineWrapper>
          )
        }
        headStyle={{
          // backgroundColor: '#477084',
          color: 'white',
          background: 'linear-gradient(to right, rgb(112, 145, 177) 0%, rgb(81, 125, 146) 100%)',
        }}
        style={{
          width: 500,
          maxHeight: 500,
        }}
        className='chat-wrapper'
      >
        {usersOnlineView ? (
          <List
            // bordered
            dataSource={chatUsers || []}
            renderItem={(item) => <ChatMember member={item} />}
            style={{
              maxHeight: '24rem',
            }}
          />
        ) : (
          <>
            <InfiniteScroll
              // pageStart={1}
              loadMore={handleLoadMore}
              // hasMore={true || false}
              useWindow={false}
              isReverse={true}
              style={{ height: '408px', overflow: 'auto', padding: '1.2rem' }}
            >
              {loadMessages()}
            </InfiniteScroll>
            <Input
              allowClear
              style={{ height: '2rem', width: '100%', marginTop: '-2rem', borderRadius: 0 }}
              placeholder='Write your message here'
              suffix={
                <Icon type='enter' style={{ cursor: 'pointer', color: 'rgba(0,0,0,.45)' }} onClick={handleMessage} />
              }
              className='chat-input'
              onPressEnter={handleMessage}
              ref={inputRef}
              disabled={chat == null}
            />
          </>
        )}
      </Card>
    </>
  );
}
