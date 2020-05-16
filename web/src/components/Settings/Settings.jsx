import React, { useEffect, useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { layout, subheader } from '../../globalStyles';
import {
  Alert,
  Button,
  Col,
  Icon,
  Input,
  Modal,
  Popconfirm,
  Typography,
  Tooltip,
  Row,
  Skeleton,
  Select,
  Switch,
} from 'antd';
import MemberSlider from './MemberSlider';
import { displaySimpleNotification } from '../../utility/services';
import { API_ENDPOINT } from '../../constants';
import { deleteRoom, getRoomAdminTiers } from '../../utility/restCalls';
import { SettingsWrapper, Text } from './SettingStyles';

const { Option } = Select;

// // Tiers of administration: 5
// 4 - can't delete members
// 3 - can't invite new members
// 2 - can't create issues but can move issues
// 1 - can't manipulate any issues
// 0 - can only see issues assigned to them

export default function Settings() {
  const email = useRef('');
  const password = useRef('');
  const isMounted = useRef(true);
  const [toTeam, setToTeam] = useState(false);
  const [adminTier, setAdminTier] = useState(1);
  const [state, setState] = useState({
    name: '',
    description: '',
    decryptPass: '',
    id: 'default',
    maxMembers: '4',
    default_admin_tier: 3,
    adminApproval: false,
    private: false,
    repository: null,
  });

  useEffect(() => {
    (async function () {
      let { data } = await axios.get(`${API_ENDPOINT}/room/info`);
      let {
        data: { administration_level },
      } = await getRoomAdminTiers();
      data.private = !!data.private;
      data.adminApproval = !!data.adminApproval;
      if (isMounted.current) {
        setState(data);
        setAdminTier(administration_level);
      }
    })().catch((err) => {
      displaySimpleNotification('Error', 4, 'bottomRight', `Unable to retrieve team info. (${err})`, 'warning', 'red');
    });

    return () => {
      isMounted.current = false;
    };
  }, []);

  const showDeleteConfirmMessage = () => {
    Modal.confirm({
      title: 'Team Deletion Confirmation',
      icon: <Icon type='exclamation-circle' />,
      content: (
        <>
          This action will be permanent. Please enter the team owner's email and password below to confirm.
          <Col type='flex' style={{ paddingTop: '2rem' }}>
            <Input
              placeholder='Email'
              style={{ margin: '0.5rem 0' }}
              type='email'
              autoComplete='nope'
              onChange={(e) => (email.current = e.target.value)}
            />
            <Input
              placeholder='Password'
              style={{ margin: '0.5rem 0' }}
              type='password'
              autoComplete='nope'
              onChange={(e) => (password.current = e.target.value)}
            />
            <Alert message='Both fields must be filled in.' type='error' style={{ marginTop: '1rem' }} />
          </Col>
        </>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        return new Promise(async (resolve) => {
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
            email.current = '';
            password.current = '';
          } finally {
            resolve();
          }
        });
      },
      onCancel() {
        email.current = '';
        password.current = '';
      },
    });
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API_ENDPOINT}/room`, state);
      displaySimpleNotification('Success', 4, 'bottomRight', 'Team settings were saved', 'smile', '#108ee9');
    } catch (err) {
      displaySimpleNotification('Error', 4, 'bottomRight', 'Team settings could not be saved', 'warning', 'red');
    }
  };

  return (
    <>
      <div style={layout}>
        <p style={{ ...subheader, opacity: state.id === 'default' ? 0.3 : 1 }}>Team Settings</p>
        <SettingsWrapper>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
              {state.id === 'default' ? (
                <>
                  <Skeleton active />
                </>
              ) : (
                <div style={{ flex: 1, padding: '0 1rem 1rem 1rem' }}>
                  <Text>Team ID: </Text>
                  <Typography.Paragraph
                    copyable={{ text: state.id || 'default' }}
                    style={{
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minWidth: '6rem',
                      border: '1px solid #d9d9d9',
                      padding: '4px 11px',
                      borderRadius: '4px',
                      backgroundColor: '#f7f7f7',
                    }}
                  >
                    {state.id}
                  </Typography.Paragraph>
                </div>
              )}
              {state.id === 'default' ? (
                <></>
              ) : (
                <div style={{ flex: 1, padding: '0 1rem 1rem 1rem' }}>
                  <Text>Repository Link: </Text>
                  <Input
                    defaultValue={state.repository || 'https://github.com'}
                    autoComplete='new-password'
                    type='text'
                    onChange={(e) => setState({ ...state, repository: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              flex: '1',
              borderBottomLeftRadius: '10px',
              borderTopLeftRadius: '10px',
              // paddingRight: '1rem',
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
                  <p style={styles.text}>Team Name: </p>
                  <Input
                    type='text'
                    defaultValue={state.name}
                    onChange={(e) => setState({ ...state, name: e.target.value })}
                  />
                </div>
                <div style={styles.wrapper}>
                  <p style={styles.text}>Team Description: </p>
                  <Input.TextArea
                    type='text'
                    defaultValue={state.description}
                    autosize={{ minRows: 10 }}
                    onChange={(e) => setState({ ...state, description: e.target.value })}
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
                  <p style={styles.text}>Team Password: </p>
                  <Input.Password
                    defaultValue={state.decryptPass}
                    autoComplete='new-password'
                    type='password'
                    onChange={(e) => setState({ ...state, decryptPass: e.target.value })}
                  />
                </div>
                <div style={styles.wrapper}>
                  <div style={{ flex: 1, padding: '0.5rem 0' }}>
                    {/* <div style={styles.wrapperC}>
                      <p style={styles.text}>Team ID: </p>
                      <Paragraph
                        copyable={{ text: state.id || 'default' }}
                        style={{ margin: 0, maxWidth: '10rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {state.id}
                      </Paragraph>
                    </div> */}
                    <div>
                      <p style={styles.text}>Max Members Limit</p>
                      <MemberSlider style={{ marginRight: '1rem' }} />
                    </div>
                    <div>
                      <Row type='flex' style={{ alignItems: 'center' }}>
                        <p style={styles.text}>Default Administration Level </p>
                        <Tooltip
                          title={
                            <span>
                              Default administration tier given to new members (can be 1-5). For more information on the
                              tiers, please look at the help section below this section.
                            </span>
                          }
                        >
                          <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
                        </Tooltip>
                      </Row>

                      <Select
                        defaultValue={state.default_admin_tier}
                        style={{ width: 120 }}
                        onChange={(tier) => {
                          setState({ ...state, default_admin_tier: tier });
                        }}
                      >
                        <Option value={0}>0</Option>
                        <Option value={1}>1</Option>
                        <Option value={2}>2</Option>
                        <Option value={3}>3</Option>
                        <Option value={4}>4</Option>
                        <Option value={5}>5</Option>
                      </Select>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: '1rem',
                      color: 'white',
                      borderRadius: '20px',
                      marginTop: '1.5rem',
                      backgroundColor: '#6c879c',
                    }}
                  >
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
                      <Switch defaultChecked={true} disabled />
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
        </SettingsWrapper>
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
            disabled={state.id === 'default' || adminTier < 5}
          >
            Delete Team
          </Button>
          <Popconfirm
            title='Are you sure you want to save?'
            onConfirm={() => handleSave()}
            okText='Yes'
            cancelText='No'
            disabled={state.id === 'default' || adminTier < 5}
            placement='topLeft'
          >
            <Button key='submit' type='primary' disabled={state.id === 'default' || adminTier < 5}>
              Save
            </Button>
          </Popconfirm>
        </div>
      </div>
      {toTeam && <Redirect push to='/team' />}
    </>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '0 1rem 1rem 1rem',
  },
  wrapperC: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingBottom: '0.5rem',
    minWidth: '15rem',
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
