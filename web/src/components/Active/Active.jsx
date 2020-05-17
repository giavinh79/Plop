import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Tooltip, Popconfirm, Icon, Table as ActiveTable, Divider, Row, Skeleton, Tag } from 'antd';
import { layout, subheader } from '../../globalStyles';
import { API_ENDPOINT, tagMap, pagination, progressMap } from '../../constants';
import { ActionText } from './ActiveStyles';
import { deleteIssue, updateIssue } from '../../utility/restCalls';
import { displaySimpleNotification, compareDates } from '../../utility/services';

export default function Active() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // toggle
  const [issue, setIssue] = useState(null); // to navigate to

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${API_ENDPOINT}/issue/team/1`);
      let activeIssues = [...data.activeItems, ...data.completedItems, ...data.progressItems];
      activeIssues.map((item, index) => {
        item.key = index;
        item.date = item.created_at.substring(0, 10);
        // item.tag = JSON.parse(item.tag); // convert "[]" to [] if using mySQL
        return item;
      });
      setLoading(false);
      setData(activeIssues);
    })().catch((err) => {
      console.log(err);
    });
  }, [refresh]);

  const handleDeletion = async (id) => {
    try {
      await deleteIssue(id);
      setRefresh(!refresh);
      displaySimpleNotification('Success', 4, 'bottomRight', 'Issue was deleted', 'smile', '#108ee9');
    } catch (err) {
      displaySimpleNotification('Error', 4, 'bottomRight', 'Issue was not deleted', 'warning', 'red');
    }
  };

  const handleProgressUpdate = async (id, status) => {
    try {
      if (status === 3) throw new Error('Issue completed, can only delete');
      await updateIssue(id, status + 1);
      setRefresh(!refresh);
    } catch (err) {
      displaySimpleNotification('Error', 4, 'bottomRight', 'Issue could not be progressed.', 'warning', 'red');
    }
  };

  const columns = [
    {
      title: 'Title',
      key: 'title',
      render: (item) => (
        <ActionText style={{ color: '#5185bb' }} onClick={() => setIssue(item)}>
          {item.title}
        </ActionText>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Tags',
      dataIndex: 'tag',
      key: 'tag',
      render: (tag) => (
        <span>
          {tag.map((item) => {
            let color = tagMap[item.toLowerCase()] || 'geekblue';
            return (
              <Tag color={color} key={item} style={{ margin: '4px 8px 4px 0' }}>
                {item.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return <p style={{ margin: 0 }}>{progressMap[status]}</p>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (item) => (
        <Row type='flex' align='middle'>
          <ActionText
            onClick={() => {
              setIssue(item);
            }}
          >
            Edit
          </ActionText>
          <Divider type='vertical' />
          <Popconfirm
            title='Are you sure you want to delete this task?'
            onConfirm={() => handleDeletion(item.id)}
            okText='Yes'
            cancelText='No'
          >
            <ActionText>Delete</ActionText>
          </Popconfirm>
          <Divider type='vertical' />
          <Popconfirm
            title='Promote to next stage?'
            onConfirm={() => handleProgressUpdate(item.id, item.status)}
            okText='Yes'
            cancelText='No'
          >
            <ActionText>Progress</ActionText>
          </Popconfirm>
        </Row>
      ),
    },
    {
      title: '',
      key: 'priority',
      render: (item) => {
        return item.deadline && compareDates(item.deadline) ? (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Tag color='red'>overdue</Tag>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
            <Tooltip title={item.priority ? 'Major Priority' : 'Minor Priority'} mouseEnterDelay={0.8}>
              {item.priority ? (
                <Icon type='arrow-up' style={{ color: '#b23f3f' }} />
              ) : (
                <Icon type='arrow-down' style={{ color: '#40b33f' }} />
              )}
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {issue && (
        <Redirect
          push
          to={{
            pathname: `/dashboard/issue/${issue.id}`,
            data: issue,
          }}
        />
      )}
      <div style={layout}>
        <p style={{ ...subheader, opacity: loading ? 0.3 : 1 }}>Active Issues</p>
        {loading ? (
          <Skeleton active />
        ) : (
          <ActiveTable
            columns={columns}
            dataSource={data}
            pagination={pagination}
            style={{ border: '1px solid #ccc', borderRadius: '5px' }}
          />
        )}
      </div>
    </>
  );
}

// Sample Data
// let data = [
// 	{
// 		key: '1',
// 		title: 'Create favicon',
// 		description: 'Convert .png to .ico',
//         date: '04/08/2019',
//         status : 'Active',
// 		tags: ['frontend', 'minor'],
// 	},
// ];
