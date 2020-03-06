import React, { useEffect, useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { layout, subheader } from '../../globalStyles';
import { Button, Col, Icon, Input, Modal, Popconfirm, Row, Typography, Tooltip, Skeleton, Switch } from 'antd';
import MemberSlider from './MemberSlider';
import { displaySimpleNotification } from '../../utility/services';
import { API_ENDPOINT } from '../../utility/constants';
import 'antd/dist/antd.css';
import { deleteRoom } from '../../utility/restCalls';

const { Paragraph } = Typography;
const { confirm } = Modal;

export default function Settings() {
  // const [loading, setLoading] = useState(false);
  const email = useRef('');
  const password = useRef('');
  const [toTeam, setToTeam] = useState(false);
  const [state, setState] = useState({
    name: '',
    description: '',
    decryptPass: '',
    id: 'default',
    maxMembers: '4',
    adminApproval: false,
    private: false,
  });

  useEffect(() => {
    (async function() {
      const res = await axios.post(`${API_ENDPOINT}/roomInfo`);
      res.data.private = !!res.data.private;
      res.data.adminApproval = !!res.data.adaminApproval;
      setState(res.data);
    })().catch(err => {
      displaySimpleNotification('Error', 4, 'bottomRight', `Unable to retrieve team info. (${err})`, 'warning', 'red');
    });
  }, []);

  const showDeleteConfirmMessage = () => {
    confirm({
      title: 'Team Deletion Confirmation',
      // (
      // <Row type='flex'>
      //   <p>Team Deletion Confirmation</p>
      //   <Icon
      //     type='loading'
      //     style={{ display: loading ? 'block' : 'none', color: '#6ca1d8', fontSize: '1.4rem', marginLeft: '0.7rem' }}
      //     spin
      //   />
      // </Row>
      // ),
      icon: <Icon type='exclamation-circle' />,
      content: (
        <>
          Your changes will be permanent. Please enter your email and password below to confirm.
          <Col type='flex' style={{ paddingTop: '2rem' }}>
            <Input
              placeholder='Email'
              style={{ margin: '0.5rem 0' }}
              type='email'
              autoComplete='new-password'
              onChange={e => (email.current = e.target.value)}
            />
            <Input
              placeholder='Password'
              style={{ margin: '0.5rem 0' }}
              type='password'
              autoComplete='new-password'
              onChange={e => (password.current = e.target.value)}
            />
          </Col>
        </>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        return new Promise(async resolve => {
          // setLoading(true);
          try {
            await deleteRoom(email.current, password.current);
            setToTeam(true);
          } catch (err) {
            displaySimpleNotification(
              'Team was not deleted',
              4,
              'bottomRight',
              'This may be due to invalid credentials. Please try again.',
              'warning',
              'red'
            );
            email.current = null;
            password.current = null;
          } finally {
            resolve();
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API_ENDPOINT}/room`, state);
      displaySimpleNotification('Success', 2, 'bottomRight', 'Team was saved', 'smile', '#108ee9');
    } catch (err) {
      displaySimpleNotification('Error', 2, 'bottomRight', 'Team could not be saved', 'warning', 'red');
    }
  };

  return (
    <>
      {toTeam && <Redirect push to='/team' />}
      <div style={layout}>
        <p style={{ ...subheader, opacity: state.id === 'default' ? 0.3 : 1 }}>Team Settings</p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '10px',
            color: '#757575',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              flex: '1',
              borderBottomLeftRadius: '10px',
              borderTopLeftRadius: '10px',
              padding: '1rem',
            }}
          >
            {state.id === 'default' ? (
              <>
                <Skeleton active />
                <Skeleton active />
              </>
            ) : (
              <>
                <div style={styles.wrapper}>
                  <p style={styles.text}>Team name: </p>
                  <Input
                    type='text'
                    defaultValue={state.name}
                    onChange={e => setState({ ...state, name: e.target.value })}
                  />
                </div>
                <div style={styles.wrapper}>
                  <p style={styles.text}>Team description: </p>
                  <Input.TextArea
                    type='text'
                    defaultValue={state.description}
                    autosize={{ minRows: 10 }}
                    onChange={e => setState({ ...state, description: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
          <div
            style={{
              backgroundColor: 'white',
              flex: '1',
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px',
              padding: '1rem',
            }}
          >
            {state.id === 'default' ? (
              <>
                <Skeleton active />
                <Skeleton active />
              </>
            ) : (
              <>
                <div style={styles.wrapper}>
                  <p style={styles.text}>Team password: </p>
                  <Input.Password
                    defaultValue={state.decryptPass}
                    autoComplete='new-password'
                    type='password'
                    onChange={e => setState({ ...state, decryptPass: e.target.value })}
                  />
                </div>
                <div style={styles.wrapper}>
                  <div style={{ flex: 1, padding: '0.5rem 0' }}>
                    <div style={styles.wrapperC}>
                      <p style={styles.text}>Team ID: </p>
                      <Paragraph
                        copyable={{ text: state.id || 'default' }}
                        style={{ margin: 0, maxWidth: '10rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {state.id}
                      </Paragraph>
                    </div>
                    <div>
                      <p style={styles.text}>Limit max members: </p>
                      <MemberSlider style={{ marginRight: '1rem' }} />
                    </div>
                    <div>
                      <p style={styles.text}>Repository Link: </p>
                      <a href='https://github.com' target='_blank' rel='noopener noreferrer'>
                        https://github.com
                      </a>
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: '0.5rem 0' }}>
                    <div style={styles.wrapperC}>
                      <Switch defaultChecked={state.private} />
                      <p style={styles.textC}>
                        Enable private team{' '}
                        <span>
                          <Tooltip title='Lock room and prevent new members'>
                            <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
                          </Tooltip>
                        </span>
                      </p>
                    </div>
                    <div style={styles.wrapperC}>
                      <Switch defaultChecked={false} disabled />
                      <p style={styles.textC}>
                        Enable logs{' '}
                        <span>
                          <Tooltip title='Preserve team history at cost of slightly slower request calls'>
                            <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
                          </Tooltip>
                        </span>
                      </p>
                    </div>
                    <div style={styles.wrapperC}>
                      <Switch defaultChecked={state.adminApproval} disabled />
                      <p style={styles.textC}>
                        Enable member approval{' '}
                        <span>
                          <Tooltip title='New members will need to be approved by team owner in order to join'>
                            <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
                          </Tooltip>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 0 1rem 1rem' }}>
          <Button
            key='submit'
            type='primary'
            style={{
              backgroundColor: '#cc8181',
              borderColor: '#cc8181',
              marginRight: '1rem',
            }}
            onClick={showDeleteConfirmMessage}
          >
            Delete Team
          </Button>
          <Popconfirm
            title='Are you sure you want to save?'
            onConfirm={() => handleSave()}
            okText='Yes'
            cancelText='No'
          >
            <Button key='submit' type='primary'>
              Save
            </Button>
          </Popconfirm>
        </div>
      </div>
    </>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingBottom: '1rem',
  },
  wrapperC: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingBottom: '0.5rem',
  },
  text: {
    margin: '0.5rem 1rem 0.5rem 0',
    fontWeight: 500,
    minWidth: '10rem',
    fontSize: '1.1rem',
  },
  textC: {
    margin: '0.5rem 0rem 0.5rem 1rem',
    minWidth: '10rem',
    fontSize: '1.1rem',
  },
};
