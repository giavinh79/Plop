import React from 'react';
import axios from 'axios';
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
import { API_ENDPOINT } from '../constants';
import ChatIcon from '../components/Chat/ChatIcon';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toHomepage: false,
      currentPage: 0,
      data: {},
      source: null,
    };
  }

  changePage = (page, params, source) => {
    this.setState({ currentPage: page, data: params, source: source });
  };

  async checkSession() {
    try {
      await axios.post(`${API_ENDPOINT}/session`);
    } catch (err) {
      this.setState({ toHomepage: true });
      displaySessionExpired();
    }
  }

  returnPage = page => {
    switch (page) {
      case 0:
        return <TeamDashboard changePage={this.changePage} checkSession={this.checkSession} />;
      case 1:
        return <UserDashboard changePage={this.changePage} checkSession={this.checkSession} />;
      case 2:
        return <Schedule />;
      case 3:
        return <Schedule />;
      case 4:
        return <MembersView />;
      case 5:
        return <WrappedCreateIssueForm changePage={this.changePage} />;
      case 6:
        return <Active changePage={this.changePage} />;
      case 7:
        return <Backlog changePage={this.changePage} />;
      case 8:
        return <Schedule />;
      case 9:
        return <Schedule />;
      case 10:
        return <Settings />;
      case 11:
        return <Issue changePage={this.changePage} data={this.state.data} source={this.state.source} />; // issue information
      case 12:
        return <Help />;
      default:
        return <TeamDashboard />;
    }
  };

  render() {
    return this.state.toHomepage ? (
      <Redirect push to='/' />
    ) : (
      <>
        <SideNav handlePageChange={page => this.changePage(page)} />
        <div style={{ display: 'flex', width: '100%' }}>{this.returnPage(this.state.currentPage)}</div>
        {/* <Dropdown overlay={menu} placement='topRight' trigger={['click']}>
          <Button>topCenter</Button>
        </Dropdown> */}
        {/* <ChatIconWrapper> */}
        <ChatIcon />

        {/* <Dropdown overlay={menu} placement='topRight' trigger={['click']}> */}
        {/* <Button>topCenter</Button> */}
        {/* </Dropdown> */}
        {/* </ChatIconWrapper> */}
      </>
    );
  }
}
