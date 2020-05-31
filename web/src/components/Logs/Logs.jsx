import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { layout, subheader } from '../../globalStyles';
import { Avatar, Input, List, Row, Skeleton, Icon, Select } from 'antd';
import { getLogs } from '../../utility/restCalls';
import moment from 'moment';
import './style.css';

export default function Logs() {
  const history = useHistory();
  const isMounted = useRef(true);

  const logIndex = useRef(30);
  const logsContainer = useRef();
  const [backup, setBackup] = useState();
  const [data, setData] = useState(['1']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { data: logs } = await getLogs();
      let formattedData = logs.reverse().map((log) => {
        return {
          description: log.description,
          object: log.object,
          type: log.type,
          issueId: log.issue_id,
          filteredByText: false,
          filteredByType: false,
          date: moment(new Date(log.date)).format('MMMM DD, YYYY'),
          time: moment(new Date(log.date)).format('hh:mm A'),
        };
      });

      if (isMounted.current) {
        setBackup(formattedData);
        setData(formattedData.slice(0, 30));
        setLoading(false);
      }

      return () => {
        isMounted.current = false;
      };
    })().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    document.addEventListener('scroll', trackScrolling);
    return () => {
      document.removeEventListener('scroll', trackScrolling);
    };
  });

  const trackScrolling = () => {
    // Check if user has scrolled to bottom of element
    if (logsContainer.current.getBoundingClientRect().bottom <= window.innerHeight + 2) {
      if (data && backup && data.length < backup.length) {
        let endIndex = logIndex.current + 30 > backup.length ? backup.length : logIndex.current + 30;
        setData((data) => [...data, ...backup.slice(logIndex.current, endIndex)]);
        logIndex.current += 30;
      }
    }
  };

  const handleFilter = (e) => {
    let userInput = e.target.value.toLowerCase();

    let filteredBackup = backup.map((item) => {
      if (
        item.description.toLowerCase().includes(userInput) ||
        item.time.toLowerCase().includes(userInput) ||
        item.date.toLowerCase().includes(userInput)
      ) {
        item.filteredByText = false;
      } else {
        item.filteredByText = true;
      }
      return item;
    });

    setData(filteredBackup);
  };

  const handleTypeFilter = (filter) => {
    let numFilter = parseInt(filter);

    if (numFilter === 0) {
      return setData(
        backup.map((item) => {
          item.filteredByType = false;
          return item;
        })
      );
    } else {
      return setData(
        backup.map((item) => {
          if (item.type === numFilter - 1) {
            item.filteredByType = false;
          } else {
            item.filteredByType = true;
          }
          return item;
        })
      );
    }
  };

  const handleLogIcon = (type) => {
    switch (type) {
      case 0:
        return 'pull-request';
      case 1:
        return 'pull-request';
      case 2:
        return 'pull-request';
      case 3:
        return 'pushpin';
      case 4:
        return 'container';
      case 5:
        return 'setting';
      case 6:
        return 'team';
      case 7:
        return 'user-add';
      case 8:
        return 'user-delete';
      case 9:
        return 'user-delete';
      case 10:
        return 'user-delete';
      case 11:
        return 'user';
      default:
        return 'pushpin';
    }
  };

  const handleLogIconColor = (type) => {
    switch (type) {
      case 0:
        return '#7C67F9';
      case 1:
        return '#51bb66';
      case 2:
        return '#de4545';
      case 3:
        return '#415ac1';
      case 4:
        return '#24D481';
      case 5:
        return '#FC80B9';
      case 6:
        return '#ec864f';
      case 7:
        return '#b85fc5';
      case 8:
        return '#3bbdbb';
      case 9:
        return '#FEBF35';
      case 10:
        return '#8aa953';
      case 11:
        return '#bd9c63';
      default:
        return '#a7a4a4';
    }
  };

  const handleLogNavigation = (type, id) => {
    switch (type) {
      case 0:
        return history.push(`/dashboard/issue/${id}`);
      case 1:
        return history.push(`/dashboard/issue/${id}`);
      case 3:
        return history.push(`/dashboard/issue/${id}`);
      case 4:
        return history.push('/dashboard/notes');
      case 5:
        return history.push('/dashboard/settings');
      case 7:
        return history.push('/dashboard/members');
      case 8:
        return history.push('/dashboard/members');
      case 9:
        return history.push('/dashboard/members');
      case 10:
        return history.push('/dashboard/members');
      case 11:
        return history.push('/dashboard/members');
      default:
        return;
    }
  };

  const isNavigable = (type) => {
    if (type === 2 || type === 6) {
      return false;
    }
    return true;
  };

  return (
    <div style={layout} ref={logsContainer}>
      <Row type='flex' style={{ alignItems: 'center' }}>
        <p style={{ ...subheader, opacity: loading ? 0.3 : 1, marginBottom: '1rem' }}>Project Logs</p>
        {loading && (
          <Icon
            type='loading'
            spin
            style={{
              color: '#6ca1d8',
              fontSize: '1.4rem',
              margin: '0 0 1rem 1rem',
            }}
          />
        )}
      </Row>
      <Row type='flex' style={{ alignItems: 'center', marginBottom: '1rem', flexWrap: 'nowrap' }}>
        <Input.Search
          allowClear
          size='large'
          placeholder='Filter logs by date or description text'
          onChange={(e) => handleFilter(e)}
          style={{
            height: '2.5rem',
          }}
          disabled={loading}
        />
        <Select
          defaultValue='0'
          style={{ marginLeft: '1rem', width: '17rem' }}
          size='large'
          onChange={handleTypeFilter}
          disabled={loading}
        >
          <Select.Option value='0'>All logs</Select.Option>
          <Select.Option value='1'>Issues created</Select.Option>
          <Select.Option value='2'>Issues updated</Select.Option>
          <Select.Option value='3'>Issues deleted</Select.Option>
          <Select.Option value='4'>Issue comments</Select.Option>
          <Select.Option value='5'>Team notes edited</Select.Option>
          <Select.Option value='6'>Team settings edited</Select.Option>
          <Select.Option value='7'>Team created</Select.Option>
          <Select.Option value='8'>Users joining</Select.Option>
          <Select.Option value='9'>Users leaving</Select.Option>
          <Select.Option value='10'>Users kicked</Select.Option>
          <Select.Option value='11'>Users banned</Select.Option>
          <Select.Option value='12'>User privileges changed</Select.Option>
        </Select>
      </Row>
      <List
        style={{ border: '1px solid #ccc' }}
        itemLayout='horizontal'
        loading={loading}
        className='log-list'
        dataSource={data.filter((item) => !item.filteredByText && !item.filteredByType)}
        renderItem={(item, index) => (
          <List.Item style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f5f5', padding: '1rem' }}>
            <Skeleton loading={loading} active paragraph={{ rows: 1 }} avatar={{ size: 'small' }}>
              <List.Item.Meta
                avatar={
                  <Avatar icon={handleLogIcon(item.type)} style={{ backgroundColor: handleLogIconColor(item.type) }} />
                }
                title={
                  <Row type='flex'>
                    <div>{item.date}</div>
                    <div style={{ marginLeft: 'auto' }}>{item.time}</div>
                  </Row>
                }
                description={
                  <Row type='flex'>
                    <div style={{ marginRight: '5rem' }}>
                      {item.description}
                      <span
                        style={{ cursor: 'pointer', fontWeight: '500', color: '#637bd0' }}
                        onClick={() => handleLogNavigation(item.type, item.issueId)}
                      >
                        {item.object}
                      </span>
                    </div>
                    {isNavigable(item.type) && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: '#6989ab',
                          cursor: 'pointer',
                          marginLeft: 'auto',
                        }}
                        onClick={() => handleLogNavigation(item.type, item.issueId)}
                      >
                        Go to <Icon type='arrow-right' style={{ marginLeft: '0.3rem' }} />
                      </div>
                    )}
                  </Row>
                }
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
}
