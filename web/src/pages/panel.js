import React, { useEffect, useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import TeamDashboard from '../components/Dashboard/TeamDashboard';
import UserDashboard from '../components/Dashboard/UserDashboard';
import Issue from '../components/Issue/Issue';
import SideNav from '../components/SideNav/SideNav';
import Backlog from '../components/Backlog/Backlog';
import MembersView from '../components/ViewMembers/ViewMembers';
import { WrappedCreateIssueForm } from '../components/CreateIssue/CreateIssue';
import Settings from '../components/Settings/Settings';
import Active from '../components/Active/Active';
import Schedule from '../components/Schedule/Schedule';
import Help from '../components/Help/Help';
import { displaySessionExpired } from '../utility/services';
import ChatIcon from '../components/Chat/ChatIcon';
import { checkAuth } from '../utility/restCalls';
import Ws from '@adonisjs/websocket-client';
import { WEB_SOCKET } from '../constants';

export default function Panel() {
  const [toHomepage, setToHomepage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState({});
  const [source, setSource] = useState(null);
  const ws = useRef(Ws(WEB_SOCKET));
  const [chat, setChat] = useState(null);
  const [chatData, setChatData] = useState({
    messages: [],
    count: 0,
  });

  useEffect(() => {
    if (chat == null) {
      ws.current.connect(); // connect to the server

      ws.current.on('open', () => {
        let chat = ws.current.subscribe('room:1');
        setChat(chat);

        // chat.on('ready', () => {
        //   // chat.emit('message', 'hello');
        // });

        chat.on('message', (data) => {
          console.log(data);
          switch (data.type) {
            case 0:
              console.log(data);
              setChatData((chatData) => {
                return { ...chatData, count: data.count };
              });
              break;
            default:
              setChatData((chatData) => {
                return { ...chatData, messages: [...chatData.messages, data] };
              });
              break;
          }
        });

        chat.on('error', (error) => {
          alert('wack');
          console.log(error);
        });
      });

      ws.current.on('close', () => {
        console.log('WS connection closed');
      });
    }

    return () => {
      ws.current.close();
    };
  }, []);

  const changePage = (page, params, source) => {
    setCurrentPage(page);
    setData(params);
    setSource(source);
  };

  const checkSession = async () => {
    try {
      await checkAuth();
    } catch (err) {
      setToHomepage(true);
      displaySessionExpired();
    }
  };

  const returnPage = (page) => {
    switch (page) {
      case 0:
        return <TeamDashboard changePage={changePage} checkSession={checkSession} />;
      case 1:
        return <UserDashboard changePage={changePage} checkSession={checkSession} />;
      case 2:
        return <Schedule />;
      case 3:
        return <Schedule />;
      case 4:
        return <MembersView />;
      case 5:
        return <WrappedCreateIssueForm changePage={changePage} />;
      case 6:
        return <Active changePage={changePage} />;
      case 7:
        return <Backlog changePage={changePage} />;
      case 8:
        return <Schedule />;
      case 9:
        return <Schedule />;
      case 10:
        return <Settings />;
      case 11:
        return <Issue changePage={changePage} data={data} source={source} />; // issue information
      case 12:
        return <Help />;
      default:
        return <TeamDashboard />;
    }
  };

  return toHomepage ? (
    <Redirect push to='/' />
  ) : (
    <>
      <SideNav handlePageChange={(page) => changePage(page)} />
      <div style={{ display: 'flex', width: '100%' }}>{returnPage(currentPage)}</div>
      <ChatIcon
        ws={ws}
        chat={chat}
        chatCount={chatData.count}
        chatMessages={chatData.messages || []}
        setChatData={setChatData}
      />
    </>
  );
}
