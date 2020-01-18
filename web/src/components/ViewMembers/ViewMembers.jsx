import React from 'react';
import 'antd/dist/antd.css';
import { Table as MembersTable } from 'antd';
import { layout, subheader } from '../../globalStyles';

const columns = [
  {
    title: 'Members',
    dataIndex: 'member',
    key: 'member',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Administration',
    dataIndex: 'administration',
    key: 'administration',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: text =>
      text !== 'Online' ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              height: '1rem',
              width: '1rem',
              backgroundColor: '#b23f3f',
              borderRadius: '50%',
              marginRight: '0.5rem',
            }}
          ></div>
          Offline
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              height: '1rem',
              width: '1rem',
              backgroundColor: '#40b33f',
              borderRadius: '50%',
              marginRight: '0.5rem',
            }}
          ></div>
          Online
        </div>
      ),
  },
];

const data = [
  {
    key: '1',
    member: 'Jim Halpert',
    role: 'Sales',
    administration: '1',
    status: 'Online',
  },
  {
    key: '2',
    member: 'Richard Hendricks',
    role: 'CEO',
    administration: '5',
    status: 'Offline',
  },
];

const pagination = {
  pageSize: 8,
  hideOnSinglePage: true,
};

// Tiers of administration: 5
// 4 - cann't delete members
// 3 - can't invite new members
// 2 - can't create issues but can move issues
// 1 - can't manipulate any issues
// 0 - can only see issues assigned to them

export default class ViewMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // API Call here
  }

  render() {
    return (
      <div style={layout}>
        <p style={subheader}>Members List</p>
        <MembersTable
          columns={columns}
          dataSource={data}
          pagination={pagination}
          style={{ border: '1px solid #ccc', borderRadius: '5px' }}
        />
      </div>
    );
  }
}
