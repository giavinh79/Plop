import React from 'react'
import PropTypes from 'prop-types'
import Dashboard from '../components/Dashboard/Dashboard';
import SideNav from '../components/SideNav/SideNav';
import Backlog from '../components/Backlog/Backlog';
import { WrappedCreateIssueForm } from '../components/CreateIssue/CreateIssue';
import MembersView from '../components/ViewMembers/ViewMembers';

export default class Panel extends React.Component {
    changePage = (page) => {
        this.setState({ currentPage: page })
    }

    returnPage = (page) => {
        switch(page) {
            case 0: return <Dashboard/>;
            case 1: return <Dashboard filter={true}/>;
            case 2: 
            case 3: 
            case 4: return <MembersView/>;
            case 5: return <WrappedCreateIssueForm/>;
            case 6:
            case 7: return <Backlog/>;
            case 8: 
            case 9: 
            default: return <Dashboard/>;
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            currentPage : 0
        }
    }

    render() {
        return (
            <>
                <SideNav handlePageChange={ (page) => { this.changePage(page) }}/>
                <div style={styles.body}>{ this.returnPage(this.state.currentPage) }</div>
            </>
        );
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

