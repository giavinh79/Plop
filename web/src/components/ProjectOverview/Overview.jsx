import React from 'react';
import { Descriptions, Badge } from 'antd';
import { layout, subheader } from '../../globalStyles';
import 'antd/dist/antd.css';

export default function Overview() {
  return (
    <div style={layout}>
      <p style={subheader}>Project Overview (placeholder)</p>
      <Descriptions
        // title='Current Development Cycle'
        bordered
      >
        <Descriptions.Item label='Project Status' span={3}>
          <Badge status='processing' text='Running' />
        </Descriptions.Item>
        <Descriptions.Item label='Active Tasks'>6</Descriptions.Item>
        <Descriptions.Item label='In Progress Tasks'>5</Descriptions.Item>
        <Descriptions.Item label='Completed Tasks'>3</Descriptions.Item>
        <Descriptions.Item label='Archived Tasks'>4</Descriptions.Item>
        <Descriptions.Item label='Tasks in backlog' span={2}>
          5
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
