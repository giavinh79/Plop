import React from 'react';
import axios from 'axios';
import { Modal, Card, Icon, Input, Button, notification } from 'antd';
import { Redirect } from 'react-router-dom';

const { TextArea } = Input;

// Seperate this JS file into seperate components later
export default class Team extends React.Component {
  constructor(props) {
    super(props);
    const teamsObject = JSON.parse(localStorage.getItem('teams'));
    this.state = {
      toHomepage: false,
      toDashboard: false,
      teamCreation: false,
      teams: teamsObject == null ? [] : teamsObject,
    };
  }

  openNotification = () => {
    notification.open({
      message: 'Session expired',
      duration: 2,
      placement: 'bottomRight',
      description: 'You need to login again.',
      icon: <Icon type='warning' style={{ color: '#108ee9' }} />,
    });
  };

  componentDidMount() {
    // axios.post('/session', null, { withCredentials: true }).then(
    axios
      .get('/getRoom', { withCredentials: true })
      .then(res => {
        if (JSON.stringify(this.state.teams) !== JSON.stringify(res.data)) {
          this.setState({ teams: res.data });
          localStorage.setItem('teams', JSON.stringify(res.data));
        }
      })
      .catch();
    // )
    //   .catch(() => {
    //     this.setState({ toHomepage: true })
    //     this.openNotification()
    //   })
  }

  openNotificationCreation = res => {
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

  openNotificationJoin = () => {
    notification.open({
      message: 'Unable to join team',
      duration: 4,
      placement: 'bottomRight',
      description: 'You may have incorrect credentials or already have a pending request to join this team.',
      icon: <Icon type='warning' style={{ color: '#108ee9' }} />,
    });
  };

  handleCreate = async () => {
    const data = {
      roomName: document.querySelector('#teamName').value,
      roomDescription: document.querySelector('#teamDescription').value,
      roomPassword: document.querySelector('#teamPassword').value,
    };

    try {
      const res = await axios.post('/createRoom', data, { withCredentials: true });
      this.setState({
        teamCreation: false,
        teams: [...this.state.teams, { name: res.data.name, description: res.data.description, id: res.data.id }],
      });
      this.openNotificationCreation(res.data);
    } catch (err) {
      this.setState({ teamCreation: false });
      this.openNotificationCreation(null);
    }
  };

  handleJoin = async () => {
    const data = {
      roomId: document.querySelector('#joinId').value,
      roomPassword: document.querySelector('#joinPassword').value,
    };

    try {
      const res = axios.post('/joinRoom', data, { withCredentials: true });
      this.setState({ toDashboard: true });
    } catch (err) {
      this.openNotificationJoin();
    }
  };

  handleCancel = () => {
    this.setState({ teamCreation: false });
  };

  handleTeamCreation = e => {
    e.preventDefault();
    this.setState({ teamCreation: true });
  };

  handleEnterTeam = async (e, team) => {
    e.preventDefault();
    await axios.post('/sessionRoom', { id: team }, { withCredentials: true });
    this.setState({ toDashboard: true });
  };

  render() {
    return !this.state.toHomepage ? (
      !this.state.toDashboard ? (
        <>
          {this.state.teamCreation ? (
            <Modal
              visible={true}
              title='Create a team'
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key='back' onClick={this.handleCancel}>
                  Return
                </Button>,
                <Button key='submit' type='primary' onClick={this.handleCreate}>
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
                  <a href='/' onClick={e => this.handleTeamCreation(e)}>
                    Create
                  </a>{' '}
                  a new team in order to begin managing your project!
                </p>
                <p>In total, you can only be a part of three maximum teams.</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <Icon
                    type='plus-circle'
                    style={{ fontSize: '2.5rem', paddingTop: '4rem', color: 'rgb(144, 181, 208)', cursor: 'pointer' }}
                    onClick={e => this.handleTeamCreation(e)}
                  />
                </div>
              </Card>
              <Card title='Join a team' style={styles.card}>
                <Input placeholder='Team ID' style={{ marginBottom: '2rem' }} id='joinId' allowClear={true} required />
                <Input.Password
                  placeholder='Team Password'
                  id='joinPassword'
                  autoComplete='new-password'
                  allowClear={true}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type='primary' style={{ marginTop: '1rem' }} onClick={() => this.handleJoin()}>
                    Join
                  </Button>
                </div>
              </Card>
            </div>
            <div style={{ display: 'flex', width: '100%', flex: '2' }}>
              <Card title='Teams joined' style={styles.card} extra={this.state.teams.length + '/3'}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {this.state.teams.map((team, index) => {
                    return (
                      <div style={styles.teams} key={index}>
                        <Card title={'Team ' + team.name} extra='1 member' style={{ minHeight: '20rem' }}>
                          <a href='/dashboard' onClick={e => this.handleEnterTeam(e, team.id)}>
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
                              onClick={e => this.handleEnterTeam(e, team.id)}
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
      ) : (
        <Redirect push to='/dashboard' />
      )
    ) : (
      <Redirect push to='/home' />
    );
  }
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
