import React, { useEffect, useState, useRef } from 'react';
import { Button, Icon, Input, Row, Select, Skeleton, Table, Tooltip, Popconfirm } from 'antd';
import { layout, subheader } from '../../globalStyles';
import { pagination } from '../../constants';
import { retrieveMembers, getRoomAdminTier } from '../../utility/restCalls';
import { displaySimpleNotification } from '../../utility/services';
import moment from 'moment';
import 'antd/dist/antd.css';

// Tiers of administration: 5
// 4 - can't change team settings
// 3 - can't invite new members
// 2 - can't create issues but can move issues
// 1 - can't manipulate any issues
// 0 - can only see issues assigned to them

export default function ViewMembers() {
  const backupData = useRef();
  const [title, setTitle] = useState('Members List');
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({ admininistration_level: 1, email: '' });

  const handleFilter = (e) => {
    let userInput = e.target.value.toLowerCase();
    if (userInput.length === 0) {
      setMemberData(backupData.current);
      return;
    }
    setMemberData(
      backupData.current.filter((item) => {
        return (
          userInput.length > 0 &&
          (item.member.toLowerCase().includes(userInput) || item.role.toLowerCase().includes(userInput))
        );
      })
    );
  };

  useEffect(() => {
    (async () => {
      const { data } = await retrieveMembers();
      const {
        data: { administration_level, user },
      } = await getRoomAdminTier();
      setCurrentUser({ administration_level, user });

      setLoading(false);
      data.sort((itemOne, itemTwo) => {
        if (itemOne.date >= itemTwo.date) {
          return -1;
        } else {
          return 1;
        }
      });
      backupData.current = data;
      setMemberData(data);
      setTitle(`Members List (${data.length})`);
    })().catch((err) => {
      displaySimpleNotification('Error', 5, 'bottomRight', `Unable to retrieve members: ${err}`, 'warning', 'red');
    });
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
      title: (
        <>
          Administration Tier
          <Tooltip title="See 'Help' section for more information">
            <Icon type='question-circle' style={{ marginLeft: '0.5rem' }} />
          </Tooltip>
        </>
      ),
      dataIndex: 'administration',
      key: 'administration',
    },
    {
      title: <Row type='flex'>Date Joined</Row>,
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>{moment(date).format('YYYY-MM-DD HH:mm:ss')}</div>
      ),
    },
    {
      title: (
        <>
          Management
          <Tooltip title='Only eligible for members tier 4 and higher.'>
            <Icon type='question-circle' style={{ marginLeft: '0.5rem' }} />
          </Tooltip>
        </>
      ),
      dataIndex: 'member',
      key: 'manage',
      render: (member) => {
        return member === currentUser.user ? (
          <></>
        ) : (
          <>
            <Popconfirm
              title={`Are you sure you want to kick ${member} from the room`}
              // onConfirm={() => handleDeletion(item.id)}
              okText='Yes'
              cancelText='No'
            >
              <Button type='danger' disabled={currentUser.administration_level <= 4}>
                Kick
              </Button>
            </Popconfirm>
            <Popconfirm
              title={`Are you sure you want to ban ${member} from the room`}
              // onConfirm={() => handleDeletion(item.id)}
              okText='Yes'
              cancelText='No'
            >
              <Button type='danger' style={{ margin: '0 1rem' }} disabled={currentUser.administration_level <= 4}>
                Ban
              </Button>
            </Popconfirm>
            <Select
              defaultValue='1'
              style={{ width: 120, margin: '1rem 0' }}
              disabled={currentUser.administration_level <= 4}
              // onChange={handleChange}
            >
              <Select.Option value='1'>Admin Tier 1</Select.Option>
              <Select.Option value='2'>Admin Tier 2</Select.Option>
              <Select.Option value='3'>Admin Tier 3</Select.Option>
              <Select.Option value='4'>Admin Tier 4</Select.Option>
              <Select.Option value='5'>Admin Tier 5</Select.Option>
            </Select>
          </>
        );
      },
    },
  ];

  return (
    <div style={layout}>
      <p style={{ ...subheader, opacity: loading ? 0.3 : 1 }}>{title}</p>
      <div style={{ marginBottom: '1rem' }}>
        <Input.Search
          allowClear
          size='large'
          placeholder='Filter member by email or role'
          onChange={(e) => handleFilter(e)}
          style={{
            height: '2.7rem',
          }}
          disabled={loading}
        />
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={memberData}
            pagination={pagination}
            style={{ border: '1px solid #ccc', borderRadius: '5px' }}
          />
        </>
      )}
    </div>
  );
}
