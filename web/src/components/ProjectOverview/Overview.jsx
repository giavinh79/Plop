import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Progress, Row } from 'antd';
import { layout, subheader } from '../../globalStyles';
import axios from 'axios';
import { API_ENDPOINT } from '../../constants';
import { LineChart, XAxis, YAxis, Legend, Tooltip, CartesianGrid, Line, ResponsiveContainer } from 'recharts';
import 'antd/dist/antd.css';

const data = [
  {
    name: 'January',
    'total tasks': 5,
    'tasks completed': 0,
    amt: 2400,
  },
  {
    name: 'February',
    'total tasks': 6,
    'tasks completed': 2,
    amt: 2210,
  },
  {
    name: 'March',
    'total tasks': 10,
    'tasks completed': 6,
    amt: 2290,
  },
  {
    name: 'April',
    'total tasks': 15,
    'tasks completed': 8,
    amt: 2000,
  },
  {
    name: 'May',
    'total tasks': 20,
    'tasks completed': 12,
    amt: 2181,
  },
  {
    name: 'June',
    'total tasks': 25,
    'tasks completed': 15,
    amt: 2500,
  },
  {
    name: 'July',
    'total tasks': 27,
    'tasks completed': 16,
    amt: 2100,
  },
];

export default function Overview() {
  const [issues, setIssues] = useState({
    activeItems: [],
    progressItems: [],
    completedItems: [],
  });

  useEffect(() => {
    (async () => {
      let { data } = await axios.get(`${API_ENDPOINT}/TeamIssue/1`);
      setIssues(data);
      console.log(data);
    })().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div style={layout}>
      <p style={subheader}>Project Overview (incomplete)</p>

      <Descriptions
        // title='Current Development Cycle'
        bordered
        style={{ marginBottom: '2rem' }}
      >
        <Descriptions.Item label='Project Status' span={3}>
          <Row type='flex' style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
            <Badge status='processing' text='Running' style={{ minWidth: '5rem' }} />
            <Progress
              strokeColor={{
                from: '#108ee9',
                to: '#87d068',
              }}
              percent={50}
              status='active'
              // style={{ marginBottom: '1rem' }}
            />
          </Row>
        </Descriptions.Item>
        <Descriptions.Item label='Active Tasks'>{issues.activeItems.length}</Descriptions.Item>
        <Descriptions.Item label='In Progress Tasks'>{issues.progressItems.length}</Descriptions.Item>
        <Descriptions.Item label='Completed Tasks'>{issues.completedItems.length}</Descriptions.Item>
        <Descriptions.Item label='Archived Tasks'>0</Descriptions.Item>
        <Descriptions.Item label='Tasks in backlog' span={2}>
          0
        </Descriptions.Item>
      </Descriptions>
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <p style={{ fontSize: '1.5rem' }}>Task Analysis</p>
        <ResponsiveContainer width={'99%'} height={400}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='total tasks' stroke='#82ca9d' />
            <Line type='monotone' dataKey='tasks completed' stroke='#8884d8' activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* <Progress
        type='circle'
        strokeColor={{
          '0%': '#79B7D4',
          '100%': '#79B7D4',
        }}
        percent={20}
      /> */}
    </div>
  );
}
