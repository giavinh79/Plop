import React from 'react'
import Dashboard from '../components/Dashboard/Dashboard';
import SideNav from '../components/SideNav/SideNav';

export default class Panel extends React.Component {
    changePage = (page) => {
        this.setState({ currentPage: page })
    }

    returnPage = (page) => {
        switch(page) {
            case 0: return <Dashboard/>;
            case 1: 
            case 2: 
            case 3: 
            default:
                return <Dashboard/>;
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
                <SideNav />
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