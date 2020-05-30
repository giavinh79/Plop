import React, { useEffect, useState, useRef } from 'react';
import { Badge, Descriptions, Progress, Row, Icon } from 'antd';
import { layout } from '../../globalStyles';
import axios from 'axios';
import { API_ENDPOINT } from '../../constants';
import { LineChart, XAxis, YAxis, Legend, Tooltip, CartesianGrid, Line, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'January',
    'tasks created ': 5,
    'tasks completed': 0,
    amt: 2400,
  },
  {
    name: 'February',
    'tasks created ': 8,
    'tasks completed': 4,
    amt: 2210,
  },
  {
    name: 'March',
    'tasks created ': 15,
    'tasks completed': 10,
    amt: 2290,
  },
  {
    name: 'April',
    'tasks created ': 2,
    'tasks completed': 2,
    amt: 2000,
  },
  {
    name: 'May',
    'tasks created ': 5,
    'tasks completed': 7,
    amt: 2181,
  },
  {
    name: 'June',
    'tasks created ': 3,
    'tasks completed': 6,
    amt: 2500,
  },
  {
    name: 'July',
    'tasks created ': 7,
    'tasks completed': 3,
    amt: 2100,
  },
];

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [backlogIssues, setBacklogIssues] = useState([]);
  const [issues, setIssues] = useState({
    activeItems: [],
    progressItems: [],
    completedItems: [],
  });
  const isMounted = useRef(true);

  useEffect(() => {
    (async () => {
      let { data: activeData } = await axios.get(`${API_ENDPOINT}/issue/team/1`);
      let { data: backlog } = await axios.get(`${API_ENDPOINT}/issue/team/0`);
      if (isMounted.current) {
        setIssues(activeData);
        setBacklogIssues(backlog);
        setLoading(false);
      }
    })().catch((err) => {
      console.log(err);
    });

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div style={layout}>
      <Row type='flex' style={{ alignItems: 'center' }}>
        <p style={{ opacity: loading ? 0.3 : 1, fontSize: '2rem', marginBottom: '1rem' }}>
          Project Overview (incomplete)
        </p>
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

      <Descriptions bordered style={{ marginBottom: '2rem' }}>
        <Descriptions.Item label='Sprint Completion' span={3}>
          <Row type='flex' style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
            <Badge status='processing' text='Running' style={{ minWidth: '5rem' }} />
            <Progress
              strokeColor={{
                from: '#108ee9',
                to: '#87d068',
              }}
              percent={Math.round(
                (issues.completedItems.length /
                  (issues.activeItems.length + issues.progressItems.length + issues.completedItems.length) || 0) * 100
              )}
              status='active'
            />
          </Row>
        </Descriptions.Item>
        <Descriptions.Item label='Active Tasks'>{issues.activeItems.length}</Descriptions.Item>
        <Descriptions.Item label='In Progress Tasks'>{issues.progressItems.length}</Descriptions.Item>
        <Descriptions.Item label='Completed Tasks'>{issues.completedItems.length}</Descriptions.Item>
        <Descriptions.Item label='Archived Tasks'>0</Descriptions.Item>
        <Descriptions.Item label='Tasks in backlog' span={2}>
          {backlogIssues.length}
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
            <Line type='monotone' dataKey='tasks created ' stroke='#82ca9d' />
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
