import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import TeamDashboard from '../components/Dashboard/TeamDashboard';
import UserDashboard from '../components/Dashboard/UserDashboard';
import Issue from '../components/Issue/Issue';
import SideNav from '../components/SideNav/SideNav';
import Backlog from '../components/Backlog/Backlog';
import MembersView from '../components/ViewMembers/ViewMembers';
import Overview from '../components/ProjectOverview/Overview';
import Settings from '../components/Settings/Settings';
import Active from '../components/Active/Active';
import Schedule from '../components/Schedule/Schedule';
import Help from '../components/Help/Help';
import { WrappedCreateIssueForm } from '../components/CreateIssue/CreateIssue';
import { displaySessionExpired } from '../utility/services';
import ChatIcon from '../components/Chat/ChatIcon';
import { checkAuth, getIssueById, getChat, getAvatar } from '../utility/restCalls';
import Ws from '@adonisjs/websocket-client';
import { WEB_SOCKET } from '../constants';
import Logs from '../components/Logs/Logs';
import Notes from '../components/Notes/Notes';

export default function Panel({ navigateToIssue }) {
  let params = useParams();
  const [toHomepage, setToHomepage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState({});
  const [source, setSource] = useState(null);

  // Chat state
  const ws = useRef(Ws(WEB_SOCKET));
  const [chat, setChat] = useState(null);
  const [chatNotification, setChatNotification] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatData, setChatData] = useState({
    messages: [],
    count: 0,
  });

  useEffect(() => {
    (async () => {
      let avatarData = await getAvatar();
      localStorage.setItem('avatar', avatarData.data.avatar);
      if (navigateToIssue) {
        let issueId = params.id;
        console.log(await getIssueById(issueId));
        // send request to issue with id as param and use this data to pass into changePage
        // console.log(id);
        // changePage(11, {}, 0);
      }
    })().catch((err) => {
      console.log(err);
    });

    if (chat == null) {
      ws.current.connect(); // connect to the server

      ws.current.on('open', () => {
        let chat = ws.current.subscribe(`room:${JSON.parse(localStorage.getItem('currentTeam')).ws_id}`);
        setChat(chat);

        chat.on('ready', async () => {
          let { data } = await getChat();
          let messages = [...chatData.messages, ...data];
          messages.sort((item, itemTwo) => {
            if (item.dateCreated <= itemTwo.dateCreated) {
              return -1;
            } else {
              return 1;
            }
          });
          setChatData((chatData) => {
            return { ...chatData, messages };
          });
          setChatLoading(false);
          // call lastCheckedChat endpoint, if the date is < most recent chat message, show red symbol
          // when user clicks chat, send a request to lastCheckedChat endpoint to refresh date and manually turn off state
        });

        /* On socket message event handler
         * 0 - members online count update, 1 - chat message, 2 - notification for user, 3 - comment made, 4 - new user joined, 5 - member left
         */
        chat.on('message', (data) => {
          switch (data.type) {
            case 0:
              setChatData((chatData) => {
                return { ...chatData, count: data.count };
              });
              break;
            case 1:
              setChatNotification(true);
              setChatData((chatData) => {
                return { ...chatData, messages: [...chatData.messages, data] };
              });
              break;
            default:
              break;
          }
        });

        chat.on('error', (error) => {
          console.log(error);
        });
      });

      ws.current.on('close', () => {
        console.log('WS connection closed');
      });
    }

    return () => {
      try {
        ws.current.close();
      } catch (err) {}
    };
  }, []);

  /* Function for switching to different pages in the dashboard
   * page - page to navigate to
   * params - data that has been passed in
   * source - page user navigated from
   */
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
        return <Overview />;
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
        return <Logs />;
      case 10:
        return <Settings />;
      case 11:
        return <Issue changePage={changePage} data={data} source={source} />; // issue information
      case 12:
        return <Help />;
      case 13:
        return <Notes />;
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
      {/* Maybe create a new context provider for these props */}
      <ChatIcon
        chat={chat}
        chatCount={chatData.count}
        chatLoading={chatLoading}
        chatMessages={chatData.messages || []}
        chatNotification={chatNotification}
        setChatNotification={setChatNotification}
        setChatData={setChatData}
      />
    </>
  );
}
