import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider, Popconfirm, Table as BacklogTable, Skeleton, Tag } from 'antd';
import { layout, subheader } from '../../globalStyles';
import { API_ENDPOINT, tagMap, pagination } from '../../utility/constants';
import { displaySimpleNotification } from '../../utility/services';
import './style.css';

export default function Backlog() {
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

  const handleDeletion = id => {
    axios
      .delete(`/issue/${id}`, { withCredentials: true })
      .then(() => {
        displaySimpleNotification('Success', 2, 'bottomRight', 'Issue was deleted', 'smile', '#108ee9');
        setRefresh(!refresh);
      })
      .catch(() => {
        displaySimpleNotification('Error', 2, 'bottomRight', 'Issue was not deleted', 'warning', 'red');
      });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: text => <a href='/'>{text}</a>,
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
      key: 'tag',
      dataIndex: 'tag',
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
        <span>
          <a href='/'>Edit</a>
          <Divider type='vertical' />
          <Popconfirm
            title='Are you sure you want to delete this task?'
            onConfirm={() => handleDeletion(item.id)}
            // onCancel={cancel}
            okText='Yes'
            cancelText='No'
          >
            <a href='/'>Delete</a>
          </Popconfirm>
          <Divider type='vertical' />
          <Popconfirm
            title='Send task to dashboard?'
            // onConfirm={}
            // onCancel={cancel}
            okText='Yes'
            cancelText='No'
          >
            <a href='/'>Make Active</a>
          </Popconfirm>
        </span>
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
