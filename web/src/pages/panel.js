import React from 'react';
import PropTypes from 'prop-types';
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
import axios from 'axios';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    // data is optional paramater to changePage() function if extra data needs to be passed to new section
    this.state = {
      toHomepage: false,
      currentPage: 0,
      data: {},
      active: null, // store information for faster perceived renders
      progress: null,
      complete: null,
      activeFiltered: null, // store information for faster perceived renders
      progressFiltered: null,
      completeFiltered: null,
    };
  }

  changePage = (page, params) => {
    this.setState({ data: params, currentPage: page });
  };

  setIssue = (active, progress, complete, filter) => {
    if (!filter) this.setState({ active, progress, complete });
    else this.setState({ activeFiltered: active, progressFiltered: progress, completeFiltered: complete });
  };

  async checkSession() {
    try {
      await axios.post('/session', null, { withCredentials: true });
    } catch (err) {
      this.setState({ toHomepage: true });
      this.openNotification();
    }
  }

  returnPage = page => {
    switch (page) {
      case 0:
        return (
          <TeamDashboard
            changePage={this.changePage}
            setIssue={this.setIssue}
            issue={{
              active: this.state.active,
              progress: this.state.progress,
              complete: this.state.complete,
            }}
            checkSession={this.checkSession}
          />
        );
      case 1:
        return (
          <UserDashboard
            changePage={this.changePage}
            setIssue={this.setIssue}
            issue={{
              active: this.state.activeFiltered,
              progress: this.state.progressFiltered,
              complete: this.state.completeFiltered,
            }}
            checkSession={this.checkSession}
          />
        );
      case 2:
        return <Schedule />;
      case 3:
        return <Schedule />;
      case 4:
        return <MembersView />;
      case 5:
        return <WrappedCreateIssueForm changePage={this.changePage} />;
      case 6:
        return <Active />;
      case 7:
        return <Backlog />;
      case 8:
        return <Schedule />;
      case 9:
        return <Schedule />;
      case 10:
        return <Settings />;
      case 11:
        return <Issue data={this.state.data} changePage={this.changePage} />; // issue information
      case 12:
        return <Help />;
      default:
        return <TeamDashboard />;
    }
  };

  render() {
    return !this.state.toHomepage ? (
      <>
        <SideNav handlePageChange={page => this.changePage(page)} />
        <div style={styles.body}>{this.returnPage(this.state.currentPage)}</div>
      </>
    ) : (
      <Redirect push to='/home' />
    );
  }
}

const styles = {
  body: {
    display: 'flex',
    width: '100%',
  },
};

Panel.propTypes = {
  page: PropTypes.number,
};
