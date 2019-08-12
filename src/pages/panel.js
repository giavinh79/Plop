import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { Icon, notification } from 'antd'
import Dashboard from '../components/Dashboard/Dashboard';
import SideNav from '../components/SideNav/SideNav';
import Backlog from '../components/Backlog/Backlog';
import MembersView from '../components/ViewMembers/ViewMembers';
import { WrappedCreateIssueForm } from '../components/CreateIssue/CreateIssue';
import Settings from '../components/Settings/Settings';

export default class Panel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            toHomepage : false,
            currentPage : 0
        }
    }

    openNotification = (status) => {
        notification.open({
            message: 'Session expired',
            duration : 2,
            placement: 'bottomRight',
            description: 'You need to login again.',
            icon: <Icon type='warning' style={{ color: '#108ee9' }} />,
        });
    };

    componentDidMount() {
        axios.post('http://localhost:3333/session', null, { headers: { Authorization : `Bearer ${localStorage.getItem('token')}`} })
        .then()
        .catch(() => {
            this.setState({ toHomepage: true })
            this.openNotification()
        })
    }

    changePage = (page) => {
        this.setState({ currentPage: page })
    }

    returnPage = (page) => {
        switch(page) {
            case 0: return <Dashboard filter={false}/>;
            case 1: return <Dashboard filter={true}/>;
            case 2: 
            case 3: 
            case 4: return <MembersView/>;
            case 5: return <WrappedCreateIssueForm/>;
            case 6:
            case 7: return <Backlog/>;
            case 8: 
            case 9: 
            case 10: return <Settings/>
            default: return <Dashboard/>;
        }
    }

    render() {
        return !this.state.toHomepage ?
            <>
                <SideNav handlePageChange={ (page) => this.changePage(page)}/>
                <div style={styles.body}>{ this.returnPage(this.state.currentPage) }</div>
            </> : <Redirect push to="/home" />
    }
}

const styles = {
    body : {
        display: 'flex',
        width: '100%'
    }
}

Panel.propTypes = {
    page : PropTypes.number
};

