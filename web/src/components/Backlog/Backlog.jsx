import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Divider, Popconfirm, Row, Table, Skeleton, Tag } from 'antd';
import { Layout, subheader } from '../../globalStyles';
import { API_ENDPOINT, tagMap, pagination } from '../../constants';
import { displaySimpleNotification } from '../../utility/services';
import { deleteIssue, updateIssue } from '../../utility/restCalls';
import { ActionText } from '../Active/ActiveStyles';
import './style.css';

export default function Backlog() {
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issue, setIssue] = useState(null); // to navigate to

  // Filtering
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${API_ENDPOINT}/issue/team/0`);
      data.map((item, index) => {
        item.key = index;
        item.date = item.created_at.substring(0, 10);
        // item.tag = JSON.parse(item.tag); // convert "[]" to [] if mySQL
        return item;
      });
      setLoading(false);
      setData(data);
    })().catch((err) => {
      console.log(err);
    });
  }, [refresh]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
  };

  const handleDeletion = async (id) => {
    try {
      await deleteIssue(id);
      displaySimpleNotification('Success', 4, 'bottomRight', 'Issue was deleted.', 'smile', '#108ee9');
      setRefresh(!refresh);
    } catch (err) {
      displaySimpleNotification('Error', 4, 'bottomRight', 'Issue was not deleted.', 'warning', 'red');
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
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
      render: (item) => (
        <ActionText style={{ color: '#5185bb' }} onClick={() => setIssue(item)}>
          {item.title}
        </ActionText>
      ),
    },
    {
      title: 'Id',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
      key: 'id',
    },
    {
      title: 'Description',
      dataIndex: 'shortDescription',
      sorter: (a, b) => a.shortDescription.localeCompare(b.shortDescription),
      sortOrder: sortedInfo.columnKey === 'shortDescription' && sortedInfo.order,
      key: 'shortDescription',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
      sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
      key: 'date',
    },
    {
      title: 'Tags',
      dataIndex: 'tag',
      key: 'tag',
      render: (tag) => (
        <span>
          {tag.map((tag) => {
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
      filters: Object.entries(tagMap).map((tag) => {
        return {
          text: tag[0].toUpperCase(),
          value: tag[0],
        };
      }),
      filteredValue: filteredInfo.tag || null,
      onFilter: (value, record) => record.tag.includes(value[0].toUpperCase() + value.slice(1)),
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
      <Layout>
        <p style={{ ...subheader, opacity: loading ? 0.3 : 1 }}>Backlog</p>
        {loading ? (
          <Skeleton active />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            style={{ border: '1px solid #ccc', borderRadius: '5px' }}
            onChange={handleChange}
          />
        )}
      </Layout>
    </>
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
