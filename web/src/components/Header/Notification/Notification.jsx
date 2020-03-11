import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Popconfirm, Row, Icon, List, message, Avatar, Spin, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import 'antd/dist/antd.css';
import { retrieveNotifications } from '../../../utility/restCalls';
import { displaySimpleNotification } from '../../../utility/services';

// Message component for when sockets are implemented
// Color for new notifications: #d4bb40

const data = [
  // {
  //   id: '1',
  //   description: "user1@gmail.com has assigned you 'Work on the frontend'.",
  //   event: 'You have been assigned to an issue.',
  //   type: 1,
  // },
  // {
  //   id: '2',
  //   description: "user2@gmail.com has assigned you 'Work on bugs'.",
  //   event: 'You have been assigned to an issue.',
  //   type: 1,
  // },
  // {
  //   id: '3',
  //   description: "user3@gmail.com has commented on 'SEO'.",
  //   email: 'fakeemail@gmail.com',
  //   event: 'There are new comments on your issue.',
  //   type: 2,
  // },
  // {
  //   id: '4',
  //   description: "user3@gmail.com has commented on 'SEO'.",
  //   email: 'fakeemail@gmail.com',
  //   event: 'There are new comments on your issue.',
  //   type: 2,
  // },
  // {
  //   id: '5',
  //   description: "user3@gmail.com has commented on 'SEO'.",
  //   email: 'fakeemail@gmail.com',
  //   event: 'There are new comments on your issue.',
  //   type: 2,
  // },
];

export default function Notification({ setShowNotificationModal }) {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [toBeRemoved, setToBeRemoved] = useState([]);
  const id = useRef(data.length);

  useEffect(() => {
    (async () => {
      let { data } = await retrieveNotifications();
      for (let item of data) {
        id.current = id.current + 1;
        if (item.type === 1) {
          setNotifications(notifications => [
            {
              id: id.current,
              description: `${item.sourceUser} has assigned you task '${item.issue}'.`,
              event: 'You have been assigned to an issue',
              status: item.status,
              type: item.type,
            },
            ...notifications,
          ]);
        } else if (item.type === 2) {
          setNotifications([
            {
              id: id.current,
              description: `${item.sourceUser} has commented on task '${item.issue}'.`,
              event: 'There are new comments on your issue.',
              status: item.status,
              type: item.type,
            },
            ...notifications,
          ]);
        }
      }
      setLoading(false);
    })().catch(err => {
      displaySimpleNotification('Error', 2, 'bottomRight', 'Unable to retrieve notifications.', 'warning', 'red');
    });
  }, []);

  const handleInfiniteOnLoad = () => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });
    if (data.length > 14) {
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    this.fetchData(res => {
      data = data.concat(res.results);
      this.setState({
        data,
        loading: false,
      });
    });
  };

  return (
    <Modal
      visible={true}
      title='Notifications'
      onOk={() => setShowNotificationModal(false)}
      onCancel={() => setShowNotificationModal(false)}
      footer={[
        <Button key='back' onClick={() => setShowNotificationModal(false)}>
          Return
        </Button>,
        <Button
          key='clear'
          style={{
            color: notifications.length === 0 ? 'rgba(0, 0, 0, 0.25)' : 'white',
            backgroundColor: notifications.length === 0 ? '#f5f5f5' : '#af5357',
          }}
          onClick={() => setShowNotificationModal(false)}
          disabled={notifications.length === 0 ? true : false}
        >
          Clear All
        </Button>,
        <Button
          key='save'
          type='primary'
          onClick={() => setShowNotificationModal(false)}
          disabled={notifications.length === 0 ? true : false}
        >
          Save
        </Button>,
      ]}
      width={800}
    >
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={false}
        useWindow={false}
        style={{
          maxHeight: '15rem',
          overflow: 'auto',
          padding: '1rem',
        }}
      >
        {loading ? (
          <Skeleton active avatar />
        ) : (
          <List
            dataSource={notifications}
            renderItem={item => (
              <List.Item key={item.id} style={{ opacity: toBeRemoved.includes(item.id) ? 0.5 : 1 }}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape='square'
                      icon={item.type === 2 ? 'form' : 'file-add'}
                      style={{ backgroundColor: item.status === 0 ? '#d4bb40' : '#8294ab' }}
                    />
                  }
                  title={
                    <>
                      <a href='/dashboard' disabled={toBeRemoved.includes(item.id) ? true : false}>
                        {item.event}
                      </a>
                      {item.status === 0 && <span style={{ color: 'blue' }}> (new!)</span>}
                    </>
                  }
                  description={item.description}
                />
                <Row type='flex' align='bottom' justify='end' style={{ flexDirection: 'column' }}>
                  <a
                    style={{ color: '#7a858e' }}
                    onClick={() => {
                      if (toBeRemoved.includes(item.id)) {
                        setToBeRemoved(toBeRemoved.filter(removedItem => removedItem !== item.id));
                      } else {
                        setToBeRemoved([...toBeRemoved, item.id]);
                      }
                    }}
                  >
                    {toBeRemoved.includes(item.id) ? 'Cancel removal' : 'Remove'}
                  </a>
                  <a href='/dashboard' disabled={toBeRemoved.includes(item.id) ? true : false}>
                    Go to issue
                  </a>
                </Row>
              </List.Item>
            )}
          ></List>
        )}
      </InfiniteScroll>
    </Modal>
  );
}
