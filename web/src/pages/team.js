import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal, Card, Icon, Input, Button, notification } from 'antd';
import { Redirect } from 'react-router-dom';

const { TextArea } = Input;

// Seperate this JS file into seperate components later
export default function Team() {
  const teamsObject = JSON.parse(localStorage.getItem('teams'));
  const [toDashboard, setToDashboard] = useState(false);
  const [teamCreation, setTeamCreation] = useState(false);
  const [teams, setTeams] = useState(teamsObject == null ? [] : teamsObject);
  const createTeamData = useRef({});
  const joinTeamData = useRef({});

  useEffect(() => {
    axios
      .get('/getRoom', { withCredentials: true })
      .then(res => {
        if (JSON.stringify(teams) !== JSON.stringify(res.data)) {
          setTeams(res.data);
          localStorage.setItem('teams', JSON.stringify(res.data));
        }
      })
      .catch();
  }, [teams]);

  const openNotification = () => {
    notification.open({
      message: 'Session expired',
      duration: 2,
      placement: 'bottomRight',
      description: 'You need to login again.',
      icon: <Icon type='warning' style={{ color: '#108ee9' }} />,
    });
  };

  const openNotificationCreation = res => {
    notification.open({
      message: res !== null ? 'Team created' : 'Team was not created',
      duration: res !== null ? 10 : 4,
      placement: 'bottomRight',
      description:
        res !== null
          ? 'The team ID is ' +
            res.id +
            ". Your credentials were also emailed to you as a backup. You may now enter the team's room."
          : 'The team could not be created, you may be at your maximum team limit.',
      icon: <Icon type={res !== null ? 'smile' : 'warning'} style={{ color: res !== null ? '#108ee9' : 'red' }} />,
    });
  };

  const openNotificationJoin = () => {
    notification.open({
      message: 'Unable to join team',
      duration: 4,
      placement: 'bottomRight',
      description: 'You may have incorrect credentials or already have a pending request to join this team.',
      icon: <Icon type='warning' style={{ color: '#108ee9' }} />,
    });
  };

  const handleCreate = async () => {
    const data = {
      roomName: document.querySelector('#teamName').value,
      roomDescription: document.querySelector('#teamDescription').value,
      roomPassword: document.querySelector('#teamPassword').value,
    };

    try {
      const res = await axios.post('/createRoom', data, { withCredentials: true });
      setTeamCreation(true);
      setTeams([...teams, { name: res.data.name, description: res.data.description, id: res.data.id }]);
      // this.setState({
      //   teamCreation: false,
      //   teams: ,
      // });
      openNotificationCreation(res.data);
    } catch (err) {
      setTeamCreation(false);
      openNotificationCreation(null);
    }
  };

  const handleJoin = async () => {
    const data = {
      roomId: joinTeamData.current.id,
      roomPassword: joinTeamData.current.password,
    };

    console.log(data);
    try {
      await axios.post('/joinRoom', data, { withCredentials: true });
      setToDashboard(true);
    } catch (err) {
      openNotificationJoin();
    }
  };

  const handleCancel = () => {
    setTeamCreation(false);
  };

  const handleTeamCreation = e => {
    e.preventDefault();
    setTeamCreation(true);
  };

  const handleEnterTeam = async (e, team) => {
    e.preventDefault();
    await axios.post('/sessionRoom', { id: team }, { withCredentials: true });
    setToDashboard(true);
  };

  return toDashboard ? (
    <Redirect push to='/dashboard' />
  ) : (
    <>
      {teamCreation ? (
        <Modal
          visible={true}
          title='Create a team'
          onCancel={handleCancel}
          footer={[
            <Button key='back' onClick={handleCancel}>
              Return
            </Button>,
            <Button key='submit' type='primary' onClick={handleCreate}>
              Save
            </Button>,
          ]}
        >
          <p>Team name:</p>
          <Input style={{ marginBottom: '1rem' }} name='teamName' id='teamName' allowClear={true} required />
          <p>Team description:</p>
          <TextArea
            autosize={{ minRows: 2, maxRows: 6 }}
            style={{ marginBottom: '1rem' }}
            name='teamDescription'
            id='teamDescription'
            required
          />
          <p>Team password:</p>
          <Input.Password
            name='teamPassword'
            id='teamPassword'
            autoComplete='new-password'
            allowClear={true}
            required
          />
        </Modal>
      ) : null}
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
                joinTeamData.current.id = e.currentTarget.value;
              }}
            />
            <Input.Password
              placeholder='Team Password'
              autoComplete='new-password'
              allowClear={true}
              onChange={e => {
                joinTeamData.current.password = e.currentTarget.value;
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='primary' style={{ marginTop: '1rem' }} onClick={() => handleJoin()}>
                Join
              </Button>
            </div>
          </Card>
        </div>
        <div style={{ display: 'flex', width: '100%', flex: '2' }}>
          <Card title='Teams joined' style={styles.card} extra={teams.length + '/3'}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {teams.map((team, index) => {
                return (
                  <div style={styles.teams} key={index}>
                    <Card title={'Team ' + team.name} extra='1 member' style={{ minHeight: '20rem' }}>
                      <a href='/dashboard' onClick={e => handleEnterTeam(e, team.id)}>
                        Enter
                      </a>
                      <p>{team.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Icon
                          type='right-circle'
                          style={{
                            fontSize: '2.5rem',
                            paddingTop: '9rem',
                            color: 'rgb(144, 181, 208)',
                            cursor: 'pointer',
                          }}
                          onClick={e => handleEnterTeam(e, team.id)}
                        />
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
    // backgroundImage: 'url(\'images/wallpaper.png\')',
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
    margin: '0 1rem',
  },
};
