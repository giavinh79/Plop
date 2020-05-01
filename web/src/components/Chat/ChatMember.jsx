import React from 'react';
import { List } from 'antd';

export default function ChatMember({ member }) {
  return (
    <List.Item
      style={{ display: 'flex', border: '1px solid #e2e2e2', margin: '1rem', padding: '1rem', borderRadius: '10px' }}
    >
      <img
        src={`/images/avatars/monster${member.avatar}.svg`}
        style={{ width: '2rem', marginRight: '1rem' }}
        alt='user icon'
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 500 }}>{member.email}</span>
        <span style={{ color: '#a9a8a8' }}>{member.role || 'N/A'}</span>
      </div>
      <div className='ring-container'>
        <div className='ringring'></div>
        <div className='circle'></div>
      </div>
    </List.Item>
  );
}
