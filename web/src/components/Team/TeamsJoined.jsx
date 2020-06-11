import React, { useContext } from 'react';
import { ThemeContext } from '../../colors/theme';
import { Avatar, Popconfirm, Row, Icon } from 'antd';
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
                  <a href='/dashboard' onClick={(e) => handleEnterTeam(e, team)}>
                    {team.name}
                  </a>
                </Row>
              }
              extra={
                <span style={{ color: theme.isLightMode ? '#232323a6' : '#595959' }}>
                  {team.currentMembers} member(s)
                </span>
              }
              theme={theme}
              nomargin={1}
              headStyle={
                theme.isLightMode
                  ? { backgroundColor: '#f8f8f8' }
                  : { border: 'none', color: 'rgba(255, 255, 255, 0.85)' }
              }
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
                    <img
                      src='/images/exit.svg'
                      alt='exit icon'
                      style={{
                        marginRight: '1rem',
                        width: '2rem',
                        transform: 'scaleX(-1)',
                        color: 'rgb(144, 181, 208)',
                      }}
                    />
                    <p style={{ margin: 0 }}>Leave</p>
                  </Row>
                </Popconfirm>
                <Row
                  type='flex'
                  align='middle'
                  style={{ marginLeft: 'auto', cursor: 'pointer' }}
                  onClick={(e) => handleEnterTeam(e, team)}
                >
                  <a href='/dashboard'>Enter</a>
                  <Icon
                    type='swap-right'
                    style={{
                      marginLeft: '0.3rem',
                      fontSize: '1.1rem',
                      color: '#79B7D4',
                    }}
                  />
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
