import React from 'react'
import PropTypes from 'prop-types'
import Dashboard from '../components/Dashboard/Dashboard';
import SideNav from '../components/SideNav/SideNav';
import Backlog from '../components/Backlog/Backlog';

export default class Panel extends React.Component {
    changePage = (page) => {
        console.log('wtf ' + page)
        this.setState({ currentPage: page })
    }

    returnPage = (page) => {
        switch(page) {
            case 0: return <Dashboard/>;
            case 1: 
            case 2: 
            case 3: 
            case 4: return <Backlog />;
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

