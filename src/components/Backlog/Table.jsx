
import React from 'react';
import 'antd/dist/antd.css';
import { Table as AntTable, Divider, Tag } from 'antd';
import './style.css'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: text => <a href="/">{text}</a>,
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
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'major') {
            color = 'volcano';
          }
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
    render: () => (
      <span>
        <a href="/">Edit</a>
        <Divider type="vertical" />
        <a href="/">Delete</a>
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    title: 'Create favicon',
    description: 'Convert .png to .ico',
    date: '04/08/2019',
    tags: ['frontend', 'minor'],
  },
  {
    key: '2',
    title: 'Google SSO',
    description: 'Implement SSO in login screen',
    date: '04/12/2019',
    tags: ['major'],
  },
  {
    key: '3',
    title: 'Server load testing',
    description: 'Test with some NPM module',
    date: '04/14/2019',
    tags: ['backend', 'minor'],
  },
];

export default function Table() {
    return (
        <AntTable columns={columns} dataSource={data} style={{border: '1px solid #ccc', borderRadius: '5px', height: '100%'}}/>
    )
}