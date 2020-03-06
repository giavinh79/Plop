import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Skeleton, Table } from 'antd';
import { layout, subheader } from '../../globalStyles';
import { pagination } from '../../utility/constants';
import { retrieveMembers } from '../../utility/restCalls';

// Tiers of administration: 5
// 4 - cann't delete members
// 3 - can't invite new members
// 2 - can't create issues but can move issues
// 1 - can't manipulate any issues
// 0 - can only see issues assigned to them

export default function ViewMembers() {
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await retrieveMembers();
      setLoading(false);
      setMemberData(data);
    })().catch(err => {
      // display simple notification
    });

    // make api call
  }, []);

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

  return (
    <div style={layout}>
      <p style={{ ...subheader, opacity: loading ? 0.3 : 1 }}>Members List</p>
      {loading ? (
        <Skeleton active />
      ) : (
        <Table
          columns={columns}
          dataSource={memberData}
          pagination={pagination}
          style={{ border: '1px solid #ccc', borderRadius: '5px' }}
        />
      )}
    </div>
  );
}
