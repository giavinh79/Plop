import React from 'react'
import Table from './Table';

export default class Backlog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div style={styles.body}>
                <Table />
            </div>
        );
    }
}

const styles = {
    body : {
        width: '100%',
        padding: '1rem'
    }
}