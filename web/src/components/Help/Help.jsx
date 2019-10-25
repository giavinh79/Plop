import React from 'react';
import { layout, subheader } from '../../globalStyles';
import { Divider } from 'antd'

export default function Help() {
    return (
        <div style={layout}>
        <p style={subheader}>Help</p>
        <div>
            Plop is an application that allows users to collaborate and manage projects within a small team. For any questions, concerns, or feedback please email email@email.com.
        </div>
        <div style={styles.table}>
            <h2 style={{ marginTop: '1rem' }}>Table of Contents</h2>
            <div>
                <Divider style={{ margin: '10px 0' }}/>
                <h3>Introduction</h3>
                <a><p>Description</p></a>
                <a><p>Tech Stack</p></a>
            </div>
            <div>
                <Divider/>
                <h3>Issues</h3>
                <a><p>Description</p></a>
                <a><p>Properties</p></a>
                <a><p>States</p></a>
            </div>
            <div>
                <Divider/>
                <h3>Settings</h3>
                <a><p>Team settings</p></a>
                <a><p>User settings</p></a>
            </div>
            <div>
                <Divider/>
                <h3>Administration</h3>
                <a><p>Managing Members</p></a>
                <a><p>Tier of Privileges</p></a>
            </div>
        </div>
        {/* <BacklogTable columns={columns} dataSource={this.state.data} pagination={pagination} style={{ border: '1px solid #ccc', borderRadius: '5px' }} /> */}
    </div>
    )
}

const styles= { 
    table : {
        border: '1px solid #ccc',
        padding: '0.5rem 1rem',
        marginTop: '2rem',
        width: '20rem',
    }
}