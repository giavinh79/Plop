import React from 'react';
import { List } from 'antd';

export default function ChatMember({ member }) {
  return (
    <List.Item
      style={{ display: 'flex', border: '1px solid #e2e2e2', margin: '1rem', padding: '1rem', borderRadius: '10px' }}
    >
      <img src='/images/avatars/monster2.svg' style={{ width: '2rem', marginRight: '1rem' }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 500 }}>{member}</span>
        <span style={{ color: '#a9a8a8' }}>Frontend Developer</span>
      </div>
      <div class='ring-container'>
        <div class='ringring'></div>
        <div class='circle'></div>
      </div>
    </List.Item>
  );
}
