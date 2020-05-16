import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Modal, Button, Icon, Popconfirm, Row, Typography, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { clearNotifications, sendNotificationsRead } from '../../../utility/restCalls';
import { displaySimpleNotification } from '../../../utility/services';

const { Text } = Typography;

// Message component for when sockets are implemented

// const sampleData = [
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
// ];

export default function Notification({ data, setNotificationData, setShowNotificationModal, setRefresh, refresh }) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [loadingIssue, setLoadingIssue] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toBeRemoved, setToBeRemoved] = useState([]);

  useEffect(() => {
    (async () => {
      if (data) {
        for (let item of data) {
          handleNotification(item);
        }
        setLoading(false);
        if (data.length > 0) await sendNotificationsRead({ notifications: data });
      }
    })().catch((err) => {
      displaySimpleNotification('Error', 4, 'bottomRight', `Unable to update notifications ${err}.`, 'warning', 'red');
    });
  }, [data]);

  const handleIssue = (e, { issueId }) => {
    e.preventDefault();
    handleCloseModal();
    history.push(`/dashboard/issue/${issueId}`);
  };

  const handleNotification = (item) => {
    // Create notification object here and add unique properties after (DRY)
    let notificationObject = {};

    switch (item.type) {
      case 1:
        setNotifications((notifications) => [
          {
            id: item.notificationId,
            issueId: item.issueId,
            description: `${item.sourceUser} has assigned you task '${item.issue}'.`,
            event: 'You have been assigned to an issue',
            status: item.status,
            type: item.type,
            date: item.date,
          },
          ...notifications,
        ]);
        break;
      case 2:
        setNotifications((notifications) => [
          {
            id: item.notificationId,
            issueId: item.issueId,
            description: `Task '${item.issue}' has been re-assigned to user ${item.assignee}.`,
            event: 'Issue no longer assigned to you',
            status: item.status,
            type: item.type,
            date: item.date,
          },
          ...notifications,
        ]);
        break;
      case 3:
        setNotifications((notifications) => [
          {
            id: item.notificationId,
            issueId: item.issueId,
            description: `${item.sourceUser} has commented on task '${item.issue}'.`,
            event: 'There are new comments on your issue.',
            status: item.status,
            type: item.type,
          },
          ...notifications,
        ]);
        break;
      case 4:
        setNotifications((notifications) => [
          {
            id: item.notificationId,
            issueId: item.issueId,
            description: (
              <span>
                {item.sourceUser}: <Text code>{item.message}</Text>
              </span>
            ),
            event: `Issue '${item.issue}' has been shared with you.`,
            status: item.status,
            type: item.type,
          },
          ...notifications,
        ]);
        break;
      default:
        break;
    }
  };

  const handleClearAll = async () => {
    await clearNotifications(data);
    handleCloseModal();
  };

  const handleSave = async () => {
    let removedNotifications = notifications.filter((item) => {
      return toBeRemoved.includes(item.id);
    });

    let removedData = data.filter((item) => {
      for (let notification of removedNotifications) {
        if (notification.id === item.notificationId) {
          return true;
        }
      }
      return false;
    });
    await clearNotifications(removedData);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setRefresh(!refresh);
    setShowNotificationModal(false);
  };

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
    this.fetchData((res) => {
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
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      footer={[
        <Button key='back' onClick={handleCloseModal}>
          Return
        </Button>,
        <Popconfirm
          key='clearConfirm'
          title='Are you sure you want remove all notifications?'
          onConfirm={handleClearAll}
          okText='Yes'
          cancelText='No'
        >
          <Button
            key='clear'
            style={{
              color: notifications.length === 0 ? 'rgba(0, 0, 0, 0.25)' : 'white',
              backgroundColor: notifications.length === 0 ? '#f5f5f5' : '#af5357',
              margin: '0 0.5rem',
            }}
            disabled={notifications.length === 0 ? true : false}
          >
            Remove All
          </Button>
        </Popconfirm>,
        <Button key='save' type='primary' onClick={handleSave} disabled={toBeRemoved.length === 0 ? true : false}>
          Remove Selected
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
            renderItem={(item) => (
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
                        setToBeRemoved(toBeRemoved.filter((removedItem) => removedItem !== item.id));
                      } else {
                        setToBeRemoved([...toBeRemoved, item.id]);
                      }
                    }}
                  >
                    {toBeRemoved.includes(item.id) ? 'Cancel removal' : 'Remove'}
                  </a>
                  <Row type='flex'>
                    <Icon
                      type='loading'
                      spin
                      style={{
                        display: loadingIssue ? 'block' : 'none',
                        color: '#6ca1d8',
                        fontSize: '1.4rem',
                        marginRight: '0.7rem',
                      }}
                    />
                    <a
                      href='/dashboard'
                      disabled={toBeRemoved.includes(item.id) ? true : false}
                      onClick={(e) => handleIssue(e, item)}
                    >
                      Go to issue
                    </a>
                  </Row>
                </Row>
              </List.Item>
            )}
          ></List>
        )}
      </InfiniteScroll>
    </Modal>
  );
}
