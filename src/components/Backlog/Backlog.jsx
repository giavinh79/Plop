import React from 'react'
import { layout, subheader } from '../../globalStyles'
import Table from './Table';

export default class Backlog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div style={layout}>
                <p style={subheader}>Create Issue</p>
                <Table />
            </div>
        );
    }
}

