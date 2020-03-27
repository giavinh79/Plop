import React, { useContext } from 'react';
import { ThemeContext } from '../../Theme';
import { Avatar, Popconfirm, Row } from 'antd';
import { JoinedTeamCard } from '../../pages/TeamPageStyles';

export default function TeamsJoined({ handleEnterTeam, handleLeaveTeam, teams }) {
  const [theme] = useContext(ThemeContext);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {teams.map((team, index) => {
        return (
          <div style={{ ...styles.teams, maxWidth: teams.length === 1 ? '40%' : 'auto' }} key={index}>
            <JoinedTeamCard
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
              extra={
                <span style={{ color: theme.isLightMode ? 'rgba(255, 255, 255, 0.65)' : '#595959' }}>
                  {team.currentMembers} member(s)
                </span>
              }
              lightmode={theme.isLightMode ? 1 : 0}
              nomargin={1}
              headStyle={theme.isLightMode ? {} : { border: 'none', color: 'rgba(255, 255, 255, 0.85)' }}
            >
              <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                <strong>ID: </strong>
                {team.id}
              </p>
              <p>
                <strong>Notifications: </strong>
                <span style={{ color: team.notifications !== 0 ? '#CC8181' : '#595959' }}>{team.notifications}</span>
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
                      src='/images/exit.svg'
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
                  {/* <Icon
                  type='right-circle'
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '2rem',
                    color: '#79B7D4',
                  }}
                /> */}
                </Row>
              </div>
            </JoinedTeamCard>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  teams: {
    flex: 1,
    margin: '0 1rem 1rem 1rem',
    minWidth: '20rem',
  },
};
