import React, { useState } from 'react';
import { Button, message as Message, Popover, Input, Select } from 'antd';
import { sendShareIssueNotification } from '../../utility/restCalls';
import './style.css';

const { Option } = Select;

export default function ShareIssue({ assignees, issue, issueId }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  let children = [];
  for (let assignee of assignees) {
    children.push(<Option key={assignee}>{assignee}</Option>);
  }

  const handleUnmount = (state) => {
    setVisible(state);
    if (!state) {
      setUsers([]);
      setMessage('');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await sendShareIssueNotification(issue, issueId, message, users);
      Message.success('Issue successfully shared!');
    } catch (err) {
      Message.error(`Issue could not be shared. ${err}`);
    } finally {
      setTimeout(() => {
        setLoading(false);
        handleUnmount(false);
      }, 500);
    }
  };

  return (
    <Popover
      content={
        <div
          style={{
            padding: '0 1rem 1rem 1rem',
            width: '20rem',
            maxWidth: '20rem',
          }}
        >
          <Select
            mode='multiple'
            style={{ width: '100%' }}
            placeholder='Users to tag'
            maxTagCount={1}
            maxTagTextLength={20}
            value={users}
            onChange={(e) => setUsers(e)}
          >
            {children}
          </Select>
          <Input
            placeholder='Notification message'
            style={{ marginTop: '1rem' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={100}
          />
          <Button
            type='primary'
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={handleSubmit}
            disabled={users.length === 0 || message == null || message.length === 0}
            loading={loading}
          >
            Share
          </Button>
        </div>
      }
      title='Share Issue'
      trigger='click'
      placement='bottomLeft'
      onVisibleChange={(state) => handleUnmount(state)}
      visible={visible}
    >
      <div className='shareButton'>
        <img src='/images/share.svg' alt='share icon' style={{ marginRight: '0.5rem' }} />
        Share
      </div>
    </Popover>
  );
}
