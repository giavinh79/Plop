import React, { useEffect, useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Layout, subheader } from '../../globalStyles';
import { Alert, Button, Col, Icon, Input, Modal, Popconfirm, Tooltip, Row, Select, Skeleton } from 'antd';
import MemberSlider from './MemberSlider';
import { displaySimpleNotification } from '../../utility/services';
import { API_ENDPOINT } from '../../constants';
import { deleteRoom, getRoomAdminTiers } from '../../utility/restCalls';
import { FlexDiv, WideDiv, DefaultWrapper, SettingsWrapper, TeamIdInput, Text } from './SettingStyles';
import SettingsToggled from './SettingsToggled';
import SkeletonLoader from './SkeletonLoader';

const { Option } = Select;

export default function Settings() {
  const email = useRef('');
  const password = useRef('');
  const isMounted = useRef(true);

  const [loading, setLoading] = useState(true);
  const [toTeam, setToTeam] = useState(false);
  const [adminTier, setAdminTier] = useState(1);
  const [state, setState] = useState({
    name: '',
    description: '',
    decryptPass: '',
    id: '123123',
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
        setLoading(false);
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
      displaySimpleNotification('Success', 4, 'bottomRight', 'Team settings were saved.', 'smile', '#108ee9');
    } catch (err) {
      displaySimpleNotification('Error', 4, 'bottomRight', 'Team settings could not be saved.', 'warning', 'red');
    }
  };

  return (
    <>
      <Layout>
        <p style={{ ...subheader, opacity: loading ? 0.3 : 1 }}>Team Settings</p>
        <SettingsWrapper>
          <WideDiv>
            <div style={{ display: 'flex', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
              <FlexDiv style={{ padding: '0 1rem 1rem 1rem' }}>
                {loading ? (
                  <SkeletonLoader />
                ) : (
                  <>
                    <Text>Team ID: </Text>
                    <TeamIdInput copyable={{ text: state.id || 'default' }}>{state.id}</TeamIdInput>
                  </>
                )}
              </FlexDiv>
              <FlexDiv style={{ padding: '0 1rem 1rem 1rem' }}>
                {loading ? (
                  <SkeletonLoader />
                ) : (
                  <>
                    <Text>Repository Link: </Text>
                    <Input
                      defaultValue={state.repository || 'https://github.com'}
                      autoComplete='new-password'
                      type='text'
                      onChange={(e) => setState({ ...state, repository: e.target.value })}
                    />
                  </>
                )}
              </FlexDiv>
            </div>
          </WideDiv>
          <FlexDiv>
            <DefaultWrapper>
              {loading ? (
                <SkeletonLoader />
              ) : (
                <>
                  <Text>Team Name: </Text>
                  <Input
                    type='text'
                    value={state.name}
                    onChange={(e) => setState({ ...state, name: e.target.value })}
                  />
                </>
              )}
            </DefaultWrapper>
            <DefaultWrapper>
              {loading ? (
                <>
                  <Skeleton active />
                </>
              ) : (
                <>
                  <Text>Team Description: </Text>
                  <Input.TextArea
                    type='text'
                    value={state.description}
                    autosize={{ minRows: 6, maxRows: 6 }}
                    maxLength={220}
                    onChange={(e) => setState({ ...state, description: e.target.value })}
                  />
                </>
              )}
            </DefaultWrapper>
          </FlexDiv>
          <div
            style={{
              backgroundColor: 'white',
              flex: '1',
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px',
            }}
          >
            <>
              <DefaultWrapper>
                {loading ? (
                  <SkeletonLoader />
                ) : (
                  <>
                    <Text>Team Password: </Text>
                    <Input.Password
                      value={state.decryptPass}
                      autoComplete='new-password'
                      type='password'
                      onChange={(e) => setState({ ...state, decryptPass: e.target.value })}
                    />
                  </>
                )}
              </DefaultWrapper>
              <DefaultWrapper>
                <div style={{ flex: 1 }}>
                  <div>
                    {loading ? (
                      <SkeletonLoader />
                    ) : (
                      <>
                        <Row type='flex' style={{ alignItems: 'center' }}>
                          <Text>Default Admin Tier: </Text>
                          <Tooltip
                            title={
                              <span>
                                This setting dictates the default administration level given to new team members. For
                                more information on the tiers, please look at the help section.
                              </span>
                            }
                          >
                            <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
                          </Tooltip>
                        </Row>

                        <Select
                          defaultValue={state.default_admin_tier}
                          style={{ width: '100%', marginBottom: '1rem' }}
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
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon type='user-add' style={{ color: '#b54141', fontSize: '3rem', marginRight: '1rem' }} />
                    <div style={{ width: '100%' }}>
                      {loading ? (
                        <SkeletonLoader />
                      ) : (
                        <>
                          <Text>Max Members Limit</Text>
                          <MemberSlider style={{ marginRight: '1rem' }} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </DefaultWrapper>
            </>
          </div>
          <SettingsToggled privateTeam={state.private} adminApproval={state.adminApproval} loading={loading} />
        </SettingsWrapper>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 0 1rem 1rem', maxWidth: '90rem' }}>
          <Button
            key='submit'
            type='danger'
            style={{
              marginRight: '1rem',
            }}
            onClick={showDeleteConfirmMessage}
            disabled={loading || adminTier < 5}
          >
            Delete Team
          </Button>
          <Popconfirm
            title='Are you sure you want to save?'
            onConfirm={() => handleSave()}
            okText='Yes'
            cancelText='No'
            disabled={loading || adminTier < 5}
            placement='topLeft'
          >
            <Button key='submit' type='primary' disabled={loading || adminTier < 5}>
              Save
            </Button>
          </Popconfirm>
        </div>
      </Layout>
      {toTeam && <Redirect push to='/team' />}
    </>
  );
}
