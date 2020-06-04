import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { layout, subheader } from '../../globalStyles';
import { Avatar, Input, List, Row, Skeleton, Icon, Select } from 'antd';
import { getLogs } from '../../utility/restCalls';
import { ActionWrapper, ObjectWrapper } from './LogStyles';
import moment from 'moment';
import './log.css';

export default function Logs() {
  const history = useHistory();
  const isMounted = useRef(true);

  const logIndex = useRef(30);
  const logsContainer = useRef();

  const [backup, setBackup] = useState();
  const [data, setData] = useState(['1']);
  const [loading, setLoading] = useState(true);
  const [filterEnabled, setFilterEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      let { data: logs } = await getLogs();
      let formattedData = logs.reverse().map((log) => {
        return {
          description: log.description,
          object: log.object,
          type: log.type,
          id: log.id,
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
        console.log(formattedData.slice(0, 30));
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

  const LOG_MAP = [
    {
      /* creating issue */
      icon: 'pull-request',
      color: '#7C67F9',
      navigation: (id) => history.push(`/dashboard/issue/${id}`),
    },
    {
      /* updating issue */
      icon: 'pull-request',
      color: '#51bb66',
      navigation: (id) => history.push(`/dashboard/issue/${id}`),
    },
    {
      /* deleting issue */
      icon: 'pull-request',
      color: '#de4545',
    },
    {
      /* commenting on issues */
      icon: 'pushpin',
      color: '#415ac1',
      navigation: (id) => history.push(`/dashboard/issue/${id}`),
    },
    {
      /* updating notes */
      icon: 'container',
      color: '#24D481',
      navigation: () => history.push('/dashboard/notes'),
    },
    {
      /* user edited team settings */
      icon: 'setting',
      color: '#FC80B9',
      navigation: () => history.push('/dashboard/settings'),
    },
    {
      /* user creating team */
      icon: 'team',
      color: '#ec864f',
    },
    {
      /* user joining team */
      icon: 'user-add',
      color: '#b85fc5',
      navigation: () => history.push('/dashboard/members'),
    },
    {
      /* user leaving team */
      icon: 'user-delete',
      color: '#3bbdbb',
      navigation: () => history.push('/dashboard/members'),
    },
    {
      /* user x kicked user y*/
      icon: 'user-delete',
      color: '#FEBF35',
      navigation: () => history.push('/dashboard/members'),
    },
    {
      /* user x banned user y*/
      icon: 'user-delete',
      color: '#ad4848',
      navigation: () => history.push('/dashboard/members'),
    },
    {
      /* user x changed the administration tier of user y */
      icon: 'user',
      color: '#bd9c63',
      navigation: () => history.push('/dashboard/members'),
    },
    {
      /* completing issue (deleting an issue in complete status)*/
      icon: 'check',
      color: '#8aa953',
    },
    {
      /* completing sprint (similar color to 12 ideally) */
      icon: 'smile',
      color: '#558658',
    },
  ];

  const trackScrolling = () => {
    // Check if user has scrolled to bottom of element

    if (logsContainer.current.getBoundingClientRect().bottom <= window.innerHeight + 2) {
      if (filterEnabled) {
      } else {
        if (data && backup && data.length < backup.length) {
          let endIndex = logIndex.current + 30 > backup.length ? backup.length : logIndex.current + 30;
          setData((data) => [...data, ...backup.slice(logIndex.current, endIndex)]);
          logIndex.current += 30;
        }
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

    // console.log('hio');
    // setData(filteredBackup);

    // filteredBacku

    if (userInput == null || userInput == '') {
      setFilterEnabled(false);
      setData(filteredBackup.slice(0, 30));
    } else {
      setFilterEnabled(true);
      setData(filteredBackup);
    }
  };

  const handleTypeFilter = (filter) => {
    let numFilter = parseInt(filter);

    if (numFilter === 0) {
      return setData(
        backup
          .map((item) => {
            item.filteredByType = false;
            return item;
          })
          .slice(0, 30)
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
    if (type < LOG_MAP.length) {
      return LOG_MAP[type].icon;
    }
    return 'pushpin';
  };

  const handleLogIconColor = (type) => {
    // standard gray color - maybe for unbanning #c1bab5
    if (type < LOG_MAP.length) {
      return LOG_MAP[type].color;
    }
    return '#a7a4a4';
  };

  const handleLogNavigation = (type, id) => {
    if (LOG_MAP[type].navigation) {
      return LOG_MAP[type].navigation(id);
    }
    return;
  };

  const handleSprintLogDescription = (description, object) => {
    const sprintName = JSON.parse(object).name;
    if (sprintName) {
      let descriptionArray = description.split(' ');
      return (
        <>
          {descriptionArray.map((word, index) => {
            if (word === 'name_placeholder') {
              return (
                <span style={{ fontWeight: 500, color: '#2b9651' }} key={index}>
                  Sprint {sprintName}{' '}
                </span>
              );
            }
            return word + ' ';
          })}
        </>
      );
    }
    return description;
  };

  const handleSprintLogObject = (object) => {
    const issues = JSON.parse(object).issues;
    return (
      <>
        {issues.map((issue, index) => {
          return (
            <React.Fragment key={index}>
              <ObjectWrapper>{issue}</ObjectWrapper>
              {index !== issues.length - 1 && ', '}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const isNavigable = (type) => {
    return !(type === 2 || type === 6 || type === 12 || type === 13);
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
          <Select.Option value='13'>Issues completed</Select.Option>
          <Select.Option value='14'>Sprints completed</Select.Option>
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
                      {item.type === 13 ? (
                        <>
                          {handleSprintLogDescription(item.description, item.object)}
                          {handleSprintLogObject(item.object)}
                        </>
                      ) : (
                        <>
                          {item.description}
                          <ObjectWrapper onClick={() => handleLogNavigation(item.type, item.issueId)}>
                            {item.object}
                          </ObjectWrapper>
                        </>
                      )}
                    </div>
                    {isNavigable(item.type) && (
                      <ActionWrapper onClick={() => handleLogNavigation(item.type, item.issueId)}>
                        Go to <Icon type='arrow-right' style={{ marginLeft: '0.3rem' }} />
                      </ActionWrapper>
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
