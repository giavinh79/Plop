import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { layout, subheader } from '../../globalStyles';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    render: (id) => <p>{id}</p>,
  },
  {
    title: 'Action',
    key: 'action',
    render: (item) => (
      <span>
        <a>Remove from blacklist</a>
      </span>
    ),
  },
];

const data = [
  {
    id: '1',
    name: 'John Brown',
  },
  {
    id: '2',
    name: 'Jim Green',
  },
  {
    id: '3',
    name: 'Joe Black',
  },
];

// rename to BannedMembersList later
export default function BannedMembers() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // make call to get banned members list
    // setLoading(false);
  }, []);

  const handleWhitelist = () => {
    //   make call to delete a user from the banned members list
  };

  return (
    <div style={layout}>
      <p style={{ ...subheader, opacity: loading ? 0.3 : 1 }}>Banned Members List</p>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
}
