import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider, Popconfirm, Row, Table as BacklogTable, Skeleton, Tag } from 'antd';
import { layout, subheader } from '../../globalStyles';
import { API_ENDPOINT, tagMap, pagination } from '../../utility/constants';
import { displaySimpleNotification } from '../../utility/services';
import { deleteIssue } from '../../utility/restCalls';
import { ActionText } from '../Active/ActiveStyles';
import './style.css';

export default function Backlog({ changePage }) {
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${API_ENDPOINT}/teamIssue/0`);
      data.map((item, index) => {
        item.key = index;
        item.date = item.created_at.substring(0, 10);
        // item.tag = JSON.parse(item.tag); // convert "[]" to [] if mySQL
        return item;
      });
      setLoading(false);
      setData(data);
    })().catch(err => {
      console.log(err);
    });
  }, [refresh]);

  const handleDeletion = async id => {
    try {
      await deleteIssue(id);
      displaySimpleNotification('Success', 2, 'bottomRight', 'Issue was deleted', 'smile', '#108ee9');
      setRefresh(!refresh);
    } catch (err) {
      displaySimpleNotification('Error', 2, 'bottomRight', 'Issue was not deleted', 'warning', 'red');
    }
  };

  const handleProgressUpdate = async (id, status) => {
    try {
      await axios.post(`${API_ENDPOINT}/issueProgress`, { id, status: status + 1 });
      setRefresh(!refresh);
    } catch (err) {
      console.log(`ERROR - Was not able to update issue ${id}`);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: text => (
        <a href='#' style={{ color: '#5185bb' }}>
          {text}
        </a>
      ),
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
      render: tag => (
        <span>
          {tag.map(tag => {
            let color = tagMap[tag.toLowerCase()];
            if (color == null) color = 'geekblue';
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: item => (
        <Row type='flex' align='middle'>
          <ActionText onClick={() => changePage(11, item, 7)}>Edit</ActionText>
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
            title='Send task to dashboard?'
            onConfirm={() => handleProgressUpdate(item.id, item.status)}
            okText='Yes'
            cancelText='No'
          >
            <ActionText>Make Active</ActionText>
          </Popconfirm>
        </Row>
      ),
    },
  ];

  return (
    <div style={layout}>
      <p style={subheader}>Backlog</p>
      {loading ? (
        <Skeleton active />
      ) : (
        <BacklogTable
          columns={columns}
          dataSource={data}
          pagination={pagination}
          style={{ border: '1px solid #ccc', borderRadius: '5px' }}
        />
      )}
    </div>
  );
}

// Sample data
// let data = [
// {
// 	key: '1',
// 	title: 'Create favicon',
// 	description: 'Convert .png to .ico',
// 	date: '04/08/2019',
// 	tags: ['frontend', 'minor'],
// }
// ];
