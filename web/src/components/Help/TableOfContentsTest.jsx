import React from 'react';
import { Tabs } from 'antd';
import 'antd/dist/antd.css';
import './TableOfContents.css';

const { TabPane } = Tabs;

const navigationArray = [
  'I. Overview',
  'II. Pages',
  'III. Issues',
  'IV. Chat',
  'V. User Settings',
  'VI. Team Settings',
  'VII. Scheduling',
  'IX. Logs',
];

export default function TableOfContentsTest({ setPage }) {
  const handleChange = (page) => {
    setPage(parseInt(page));
  };

  return (
    <Tabs
      defaultActiveKey='0'
      tabPosition={'left'}
      style={{ height: '20rem' }}
      onChange={handleChange}
      className='navigation-table'
    >
      {[...navigationArray.keys()].map((i) => (
        <TabPane tab={navigationArray[i]} key={i} />
      ))}
    </Tabs>
  );
}
