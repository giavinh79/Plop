import React from 'react'
import Overview from '../components/Overview/Overview';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={styles.body}>
                <Overview />
            </div>
        );
    }
}

const styles = {
    body : {
        display: 'flex',
        width: '100%'
    }
}