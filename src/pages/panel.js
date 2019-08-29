import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { Icon, notification } from 'antd'
import TeamDashboard from '../components/Dashboard/TeamDashboard'
import UserDashboard from '../components/Dashboard/UserDashboard'
import Issue from '../components/Issue/Issue'
import SideNav from '../components/SideNav/SideNav'
import Backlog from '../components/Backlog/Backlog'
import MembersView from '../components/ViewMembers/ViewMembers'
import { WrappedCreateIssueForm } from '../components/CreateIssue/CreateIssue'
import Settings from '../components/Settings/Settings'
import Active from '../components/Active/Active';
import Schedule from '../components/Schedule/Schedule';

export default class Panel extends React.Component {
  constructor(props) {
    super(props)
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
      completeFiltered: null
    }
  }

  openNotification = () => {
    notification.open({
      message: 'Session expired',
      duration: 2,
      placement: 'bottomRight',
      description: 'You need to login again.',
      icon: <Icon type='warning' style={{ color: '#108ee9' }} />,
    });
  };

  componentDidMount() {
    axios.post('/session', null, { withCredentials: true })
      .then()
      .catch(() => {
        this.setState({ toHomepage: true })
        this.openNotification()
      })
  }

  changePage = (page, params) => {
    this.setState({ data: params, currentPage: page })
  }

  setIssue = (active, progress, complete, filter) => {
    if (!filter)
      this.setState({ active, progress, complete })
    else
      this.setState({ activeFiltered: active, progressFiltered: progress, completeFiltered: complete })
  }

  returnPage = (page) => {
    switch (page) {
      case 0: return <TeamDashboard changePage={this.changePage} setIssue={this.setIssue} issue={{ active: this.state.active, progress: this.state.progress, complete: this.state.complete }} />;
      case 1: return <UserDashboard changePage={this.changePage} setIssue={this.setIssue} issue={{ active: this.state.activeFiltered, progress: this.state.progressFiltered, complete: this.state.completeFiltered }} />;
      case 2: return <Schedule />;
      case 3: return <Schedule />;
      case 4: return <MembersView />;
      case 5: return <WrappedCreateIssueForm changePage={this.changePage} />;
      case 6: return <Active />;
      case 7: return <Backlog />;
      case 8: return <Schedule />;
      case 9: return <Schedule />;
      case 10: return <Settings />;
      case 11: return <Issue data={this.state.data} changePage={this.changePage} />;
      default: return <TeamDashboard />;
    }
  }

  render() {
    return !this.state.toHomepage ?
      <>
        <SideNav handlePageChange={(page) => this.changePage(page)} />
        <div style={styles.body}>{this.returnPage(this.state.currentPage)}</div>
      </> : <Redirect push to="/home" />
  }
}

const styles = {
  body: {
    display: 'flex',
    width: '100%'
  }
}

Panel.propTypes = {
  page: PropTypes.number
};

