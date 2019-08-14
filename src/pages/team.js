import React from 'react'
import axios from 'axios'
import { Modal, Card, Icon, Input, Button, notification } from 'antd'

// Seperate this JS file into seperate components later

export default class Team extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            toDashboard : false,
            teamCreation : false,
            teams : [
                {
                    name: 'Side Projectors',
                    description: 'A team originating from NCR. Wastes a lot of time on side projects.',
                }
            ]
        }
    }

    openNotification = (res) => {
        notification.open({
            message: res !== null ? 'Team created' : 'Team was not created',
            duration : res !== null ? 10 : 4,
            placement: 'bottomRight',
            description: res !== null ? 'The team ID is ' + res.id + ' and the password is ' + res.password + '. These credentials were also emailed to you as a backup. You may now enter the team\'s room.' :
            'The team could not be created, you may be at your maximum team limit.',
            icon: <Icon type={res !== null ? 'smile' : 'warning'} style={{ color: '#108ee9' }} />,
        });
    }
    
    handleCreate = () => {
        const data = {
            roomName : document.querySelector('#teamName').value,
            roomDescription : document.querySelector('#teamDescription').value,
            roomPassword : document.querySelector('#teamPassword').value,
        }
        axios.post('/createTeam', data, { withCredentials: true })
        .then(res => {
            this.setState({ teamCreation: false, teams : [...this.state.teams, { name : res.data.name, description : res.data.description }]})
            // console.log(res.data)
            // console.log(this.state.teams)
            this.openNotification(res.data)
        })
        .catch(err => {
            // console.log(err)
            // console.log(data)
            this.setState({ teamCreation: false })
            this.openNotification(null);
        })
    }
    
    handleCancel = () => {
        this.setState({ teamCreation: false });
    };

    handleTeamCreation = () => {
        this.setState({teamCreation : true})
    }

    render() {
        return (
            <>
            { this.state.teamCreation ?
            <Modal
                visible={true}
                title="Create a team"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleCreate}>
                        Save
                    </Button>,
            ]}>
                <p>Team name:</p><Input style={{marginBottom: '1rem'}} name="teamName" id="teamName" required/>
                <p>Team description:</p><Input style={{marginBottom: '1rem'}} name="teamDescription" id="teamDescription" required/>
                <p>Team password:</p><Input name="teamPassword" id="teamPassword" required/>
            </Modal> : '' }
            <div style={styles.container}>
                <div style={styles.subcontainer}>   
                    <Card title="Make a team" style={styles.card}>
                            <p><a href="/">Create</a> a new team in order to begin managing your project!</p>
                            <p>In total, you can only be a part of three maximum teams.</p>
                            <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                <Icon type="plus-circle" style={{ fontSize: '2.5rem', paddingTop: '4rem', color: 'rgb(144, 181, 208)', cursor: 'pointer' }} onClick={this.handleTeamCreation}/>
                            </div>
                    </Card>
                    <Card title="Join a team" style={styles.card}>
                        <Input placeholder='Team ID' style={{ marginBottom: '2rem' }}/>
                        <Input placeholder='Team Password'/>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}><Button type="primary" style={{marginTop: '1rem'}}>Join</Button></div>
                    </Card> 
                </div>
                <div style={{display: 'flex', width: '100%', flex: '2'}}>
                    <Card title="Teams joined" style={styles.card} extra={this.state.teams.length + '/3'}>
                        <div style={{display: 'flex', flexWrap: 'wrap'}}>
                            {
                                this.state.teams.map((team, index) => {
                                    return (
                                        <div style={styles.teams} key={index}>
                                            <Card title={'Team ' + team.name} extra="1 member" style={{minHeight: '20rem'}}>
                                                <a href="/dashboard">Enter</a>
                                                <p>{team.description}</p>
                                                <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                                    <Icon type="right-circle" style={{ fontSize: '2.5rem', paddingTop: '9rem', color: 'rgb(144, 181, 208)', cursor: 'pointer' }} onClick={this.handleTeamCreation}/>
                                                </div>
                                            </Card>
                                        </div>
                                    )
                                })
                            }
                            {/* <div style={styles.teams}>
                                <Card title="Team 1" extra="5 members" style={{minHeight: '20rem'}}>
                                    <a href="/">Enter</a>
                                    <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                        <Icon type="right-circle" style={{ fontSize: '2.5rem', paddingTop: '9rem', color: 'rgb(144, 181, 208)', cursor: 'pointer' }} onClick={this.handleTeamCreation}/>
                                    </div>
                                </Card>
                            </div>
                            <div style={styles.teams}>
                                <Card title="Team 2" extra="3 members" style={{minHeight: '20rem'}}>
                                    <a href="/">Enter</a>
                                    <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                        <Icon type="right-circle" style={{ fontSize: '2.5rem', paddingTop: '9rem', color: 'rgb(144, 181, 208)', cursor: 'pointer' }} onClick={this.handleTeamCreation}/>
                                    </div>
                                </Card>
                            </div>
                            <div style={styles.teams}>
                                <Card title="N/A" extra="N/A" style={{minHeight: '20rem'}}>
                                    <a href="/">Enter</a>
                                    <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                        <Icon type="right-circle" style={{ fontSize: '2.5rem', paddingTop: '9rem', color: 'rgb(144, 181, 208)', cursor: 'pointer' }} onClick={this.handleTeamCreation}/>
                                    </div>
                                </Card>
                            </div> */}
                        </div>
                    </Card>
                </div>
            </div>
            </>
        );
    }
}

const styles = {
    container : {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        width:'100%',
        backgroundImage: 'url(\'images/wallpaper.png\')',
        backgroundPosition: '0 0'
    },
    subcontainer : {
        display: 'flex',
        width: '100%'
    },
    card : {
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        margin: '1rem',
        flex: 1,
    },
    teams : {
        flex: 1,
        margin: '0 1rem'
    }
  }

