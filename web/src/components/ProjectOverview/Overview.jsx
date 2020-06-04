import React, { useEffect, useState, useRef } from 'react';
import { Badge, Descriptions, Progress, Row, Icon, Spin } from 'antd';
import { layout } from '../../globalStyles';
import { LineChart, XAxis, YAxis, Legend, Tooltip, CartesianGrid, Line, ResponsiveContainer } from 'recharts';
import { getIssues, getLogsForGraph } from '../../utility/restCalls';
import axios from 'axios';
import { API_ENDPOINT } from '../../constants';

// Determine graph's x axis based on current month
const relativeLogsObject = () => {
  const currentMonth = new Date().getMonth();

  const logsObject = [
    { name: 'January', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'Februry', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'March', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'April', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'May', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'June', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'July', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'August', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'September', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'October', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'November', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'December', 'tasks created': 0, 'tasks completed': 0 },
  ];

  const relativeLogsObject = [];
  for (let i = 0; i < 12; i++) {
    let conversion = i + (12 - currentMonth);
    if (conversion < 12) {
      relativeLogsObject[i] = logsObject[conversion];
    } else {
      relativeLogsObject[i] = logsObject[conversion - 12];
    }
  }
  return { relativeLogsObject };
};

const logsToData = (logs) => {
  const { relativeLogsObject: logsObject } = relativeLogsObject();
  const monthMap = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  for (let log of logs) {
    const month = new Date(log.date).getMonth();
    let monthIndex = 0; // actual month index in my log object
    for (let i = 0; i < logsObject.length; i++) {
      if (logsObject[i].name === monthMap[month]) {
        monthIndex = i;
        break;
      }
    }

    let tasksCreated = logsObject[monthIndex]['tasks created'];
    let tasksCompleted = logsObject[monthIndex]['tasks completed'];

    if (log.type === 0) {
      logsObject[monthIndex]['tasks created'] = ++tasksCreated;
    } else if (log.type === 12) {
      logsObject[monthIndex]['tasks completed'] = ++tasksCompleted;
    } else if (log.type === 13) {
      const issues = JSON.parse(log.object).issues;
      tasksCompleted += issues.length;
      logsObject[monthIndex]['tasks completed'] = tasksCompleted;
    }
  }
  return logsObject;
};

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [backlogIssues, setBacklogIssues] = useState([]);
  const [issues, setIssues] = useState({
    activeItems: [],
    progressItems: [],
    completedItems: [],
  });
  const [logs, setLogs] = useState([]); // for graph
  const isMounted = useRef(true);

  useEffect(() => {
    (async () => {
      let { data: activeData } = await getIssues('team');
      let { data: backlog } = await axios.get(`${API_ENDPOINT}/issue/team/0`);
      let { data: logs } = await getLogsForGraph();
      if (isMounted.current) {
        setIssues(activeData);
        setBacklogIssues(backlog);
        setLogs(logsToData(logs));
        setLoading(false);
      }
    })().catch((err) => {
      console.log(err);
    });

    return () => {
      isMounted.current = false;
    };
  }, [logsToData]);

  return (
    <div style={layout}>
      <Row type='flex' style={{ alignItems: 'center' }}>
        <p style={{ opacity: loading ? 0.3 : 1, fontSize: '2rem', marginBottom: '1rem' }}>Project Overview</p>
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

      <Spin tip='Loading...' spinning={loading}>
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
          <Descriptions.Item label='Tasks in backlog'>{backlogIssues.length}</Descriptions.Item>
        </Descriptions>
      </Spin>
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <p style={{ fontSize: '1.5rem' }}>Issues Analysis</p>
        {!loading && (
          <ResponsiveContainer width={'99%'} height={400}>
            <LineChart
              data={logs}
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
              <Line type='monotone' dataKey='tasks created' stroke='#82ca9d' />
              <Line type='monotone' dataKey='tasks completed' stroke='#8884d8' activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
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

/*
  const exampleData = [
    {
      name: 'January',
      'tasks created ': 5,
      'tasks completed': 0,
    },
  ];
*/
