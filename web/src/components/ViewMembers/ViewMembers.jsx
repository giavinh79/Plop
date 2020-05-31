import React, { useEffect, useState, useRef } from 'react';
import { Button, Icon, Input, Row, Select, Skeleton, Table, Tooltip, Popconfirm, message } from 'antd';
import { layout, subheader } from '../../globalStyles';
import { pagination } from '../../constants';
import { retrieveMembers, getRoomAdminTiers, removeMember, updateUserAdminTier } from '../../utility/restCalls';
import { displaySimpleNotification } from '../../utility/services';
import moment from 'moment';
// import 'antd/dist/antd.css';

// Tiers of administration: 5
// 4 - can't change team settings
// 3 - can't invite new members
// 2 - can't create issues but can move issues
// 1 - can't manipulate any issues
// 0 - can only see issues assigned to them

export default function ViewMembers() {
  const backupData = useRef();
  const [refresh, setRefresh] = useState(false); // for refreshing DB calls
  const [title, setTitle] = useState('Members List');
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({ admininistration_level: 1, email: '' });

  useEffect(() => {
    (async () => {
      const { data } = await retrieveMembers();
      const {
        data: { administration_level, user },
      } = await getRoomAdminTiers();
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
  }, [refresh]);

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

  const handleMemberRemoval = async (id, name, type) => {
    try {
      await removeMember(id, name, type);
      setRefresh(!refresh);
      displaySimpleNotification(
        'Success',
        4,
        'bottomRight',
        'Member has been terminated from the team.',
        'smile',
        '#108ee9'
      );
    } catch (err) {
      displaySimpleNotification(
        'Error',
        4,
        'bottomRight',
        `Member could not be terminated from the team: ${err}.`,
        'warning',
        'red'
      );
    }
  };

  const handleTierChange = async (name, id, tier) => {
    try {
      await updateUserAdminTier(name, id, tier);
      message.success('Changes were successfully saved');
    } catch (err) {
      console.log(err);
      message.error('Changes were not saved');
    } finally {
      setRefresh(!refresh);
    }
  };

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
          <Tooltip title='(Tier 4+) Kick, ban, or manage privileges for team members'>
            <Icon type='question-circle' style={{ marginLeft: '0.5rem' }} />
          </Tooltip>
        </>
      ),
      key: 'manage',
      render: (item) => {
        return item.member === currentUser.user ||
          currentUser.administration_level <= 3 ||
          item.administration > currentUser.administration_level ? (
          <></>
        ) : (
          <>
            <Popconfirm
              title={`Are you sure you want to kick ${item.member} from the room?`}
              onConfirm={() => handleMemberRemoval(item.id, item.member, 0)}
              okText='Yes'
              cancelText='No'
            >
              <Button type='danger'>Kick</Button>
            </Popconfirm>
            <Popconfirm
              title={`Are you sure you want to ban ${item.member} from the room?`}
              onConfirm={() => handleMemberRemoval(item.id, item.member, 1)}
              okText='Yes'
              cancelText='No'
            >
              <Button type='danger' style={{ margin: '0 1rem' }}>
                Ban
              </Button>
            </Popconfirm>
            <Select
              defaultValue={item.administration}
              style={{ width: 120, margin: '1rem 0' }}
              onChange={(tier) => handleTierChange(item.member, item.id, tier)}
            >
              {currentUser.administration_level >= 1 && <Select.Option value={1}>Admin Tier 1</Select.Option>}
              {currentUser.administration_level >= 2 && <Select.Option value={2}>Admin Tier 2</Select.Option>}
              {currentUser.administration_level >= 3 && <Select.Option value={3}>Admin Tier 3</Select.Option>}
              {currentUser.administration_level >= 4 && <Select.Option value={4}>Admin Tier 4</Select.Option>}
              {currentUser.administration_level >= 5 && <Select.Option value={5}>Admin Tier 5</Select.Option>}
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
