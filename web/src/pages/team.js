import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Alert, Avatar, Button, Card, Icon, Input, Popconfirm, Row } from 'antd';
import { Redirect } from 'react-router-dom';
import { displaySimpleNotification } from '../utility/services';
import { API_ENDPOINT } from '../utility/constants';
import { retrieveTeams } from '../utility/restCalls';
import TeamCreationModal from '../components/Team/TeamCreationModal';

// Seperate this JS file into seperate components later
export default function Team() {
  let teamsObject = JSON.parse(localStorage.getItem('teams'));

  const [loading, setLoading] = useState(true);
  const [toDashboard, setToDashboard] = useState(false);
  const [teamCreation, setTeamCreation] = useState(false);
  const [teams, setTeams] = useState(teamsObject == null ? [] : teamsObject);
  const [teamJoinError, setTeamJoinError] = useState(false);
  const joinTeamData = useRef({});

  useEffect(() => {
    (async () => {
      const res = await retrieveTeams();
      setTeams(res.data);
      localStorage.setItem('teams', JSON.stringify(res.data));
      setLoading(false);
    })().catch(err => {
      displaySimpleNotification('Error', 4, 'bottomRight', `Unable to retrieve teams. (${err})`, 'warning', 'red');
    });
  }, []);

  const handleLeaveTeam = async teamId => {
    try {
      await axios.post('/leaveRoom', { teamId });
      setTeams(
        teams.filter(item => {
          return item.id !== teamId;
        })
      );
    } catch (err) {
      displaySimpleNotification(
        'Error',
        4,
        'bottomRight',
        `Unable to leave team. If you are the owner, please delete the team through settings. (${err})`,
        'warning',
        'red'
      );
    }
  };

  const handleJoin = async () => {
    const data = {
      roomId: joinTeamData.current.id,
      roomPassword: joinTeamData.current.password,
    };

    if (!data.roomId || !data.roomPassword) {
      setTeamJoinError(true);
      return;
    }

    if (teamJoinError) {
      setTeamJoinError(false);
    }

    try {
      await axios.post(`${API_ENDPOINT}/joinRoom`, data, { withCredentials: true });
      const res = await retrieveTeams();
      localStorage.setItem('teams', JSON.stringify(res.data));
      localStorage.setItem('currentTeam', data.roomId);
      setToDashboard(true);
    } catch (err) {
      displaySimpleNotification(
        'Unable to join team',
        4,
        'bottomRight',
        'The team may be private, your credentials may be incorrect, or you may already have a pending request to join the team.',
        'warning',
        '#108ee9'
      );
    }
  };

  const handleTeamCreation = e => {
    e.preventDefault();
    setTeamCreation(true);
  };

  const handleEnterTeam = async (e, team) => {
    e.preventDefault();
    localStorage.setItem('currentTeam', team);
    await axios.post(`${API_ENDPOINT}/sessionRoom`, { id: team });
    setToDashboard(true);
  };

  return toDashboard ? (
    <Redirect push to='/dashboard' />
  ) : (
    <>
      {teamCreation && <TeamCreationModal setTeams={setTeams} setTeamCreation={setTeamCreation} teams={teams} />}
      <div style={styles.container}>
        <div style={styles.subcontainer}>
          <Card title='Make a team' style={styles.card}>
            <p>
              <a href='/' onClick={e => handleTeamCreation(e)}>
                Create
              </a>{' '}
              a new team in order to begin managing your project!
            </p>
            <p>In total, you can only be a part of three maximum teams.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <Icon
                type='plus-circle'
                style={{ fontSize: '2.5rem', paddingTop: '4rem', color: 'rgb(144, 181, 208)', cursor: 'pointer' }}
                onClick={e => handleTeamCreation(e)}
              />
            </div>
          </Card>
          <Card title='Join a team' style={styles.card}>
            <Input
              placeholder='Team ID'
              style={{ marginBottom: '2rem' }}
              allowClear={true}
              onChange={e => {
                if (teamJoinError) setTeamJoinError(false);
                joinTeamData.current.id = e.currentTarget.value;
              }}
            />
            <Input.Password
              placeholder='Team Password'
              autoComplete='new-password'
              allowClear={true}
              onChange={e => {
                if (teamJoinError) setTeamJoinError(false);
                joinTeamData.current.password = e.currentTarget.value;
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem' }}>
              {teamJoinError && (
                <Alert
                  message='All fields must be filled in.'
                  type='error'
                  showIcon
                  style={{ margin: '-0.5rem auto 0 0' }}
                />
              )}
              <Button type='primary' onClick={() => handleJoin()}>
                Join
              </Button>
            </div>
          </Card>
        </div>
        <div style={{ display: 'flex', width: '100%', flex: '2' }}>
          <Card
            title={
              <Row type='flex'>
                Teams joined
                <Icon
                  type='loading'
                  style={{
                    display: loading ? 'block' : 'none',
                    color: '#6ca1d8',
                    fontSize: '1.4rem',
                    marginLeft: '0.7rem',
                  }}
                  spin
                />
              </Row>
            }
            style={styles.card}
            extra={<p style={{ color: teams.length === 3 ? '#d45f5f' : 'black' }}>{teams.length}/3</p>}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {teams.map((team, index) => {
                return (
                  <div style={styles.teams} key={index}>
                    <Card
                      title={
                        <Row type='flex' align='middle' style={{ flexFlow: 'nowrap' }}>
                          <Avatar
                            size='large'
                            icon='team'
                            style={{ marginRight: '1rem', minWidth: '2.5rem', backgroundColor: '#3d74c7' }}
                          />
                          <a href='/dashboard' onClick={e => handleEnterTeam(e, team.id)}>
                            {team.name}
                          </a>
                        </Row>
                      }
                      extra={team.currentMembers + ' member(s)'}
                      style={{ minHeight: '20rem', height: '100%' }}
                    >
                      <p>
                        <strong>ID: </strong>
                        {team.id}
                      </p>
                      <p>
                        <strong>Notifications: 0</strong>
                      </p>
                      <div style={{ height: '6rem', marginBottom: '2rem' }}>
                        <strong>Description: </strong>
                        {team.description}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Popconfirm
                          title='Are you sure you want to leave this team?'
                          onConfirm={() => handleLeaveTeam(team.id)}
                          okText='Yes'
                          cancelText='No'
                        >
                          <Row type='flex' align='middle' style={{ cursor: 'pointer' }}>
                            <p style={{ margin: 0 }}>Leave</p>
                            <img
                              src='images/exit.svg'
                              alt='exit icon'
                              style={{
                                margin: '0 0.5rem',
                                width: '2rem',
                                transform: 'scaleX(-1)',
                                color: 'rgb(144, 181, 208)',
                              }}
                            />
                          </Row>
                        </Popconfirm>
                        <Row
                          type='flex'
                          align='middle'
                          style={{ marginLeft: 'auto', cursor: 'pointer' }}
                          onClick={e => handleEnterTeam(e, team.id)}
                        >
                          <a href='/dashboard'>Enter</a>
                          <Icon
                            type='right-circle'
                            style={{
                              marginLeft: '0.5rem',
                              fontSize: '2rem',
                              color: '#79B7D4',
                            }}
                          />
                        </Row>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: '100%',
    backgroundPosition: '0 0',
  },
  subcontainer: {
    display: 'flex',
    width: '100%',
    marginTop: '1rem',
  },
  card: {
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    margin: '1rem',
    flex: 1,
  },
  teams: {
    flex: 1,
    maxWidth: '40%',
    margin: '0 1rem 1rem 1rem',
  },
};
