import React from 'react';
import UserPanel from './UserPanel/UserPanel';
import { HeaderWrapper, Logo } from './style.js';
import { WrappedHorizontalLoginForm } from './LoginForm.jsx';
import { useHistory } from 'react-router-dom';
import TeamDropdown from './TeamDropdown';

export default function Header() {
  let history = useHistory();
  let { location } = history;

  const handleClick = () => {
    if (location.pathname !== '/') {
      history.push('/team');
    }
  };

  const getTeamLabel = () => {
    try {
      for (let item of JSON.parse(localStorage.getItem('teams'))) {
        if (item.id.toString() === localStorage.getItem('currentTeam')) {
          return item.name;
        }
      }
    } catch (err) {
      return '';
    }
  };

  return (
    <HeaderWrapper style={{ backgroundColor: location.pathname === '/' ? '#445D66' : '#79B7D4' }}>
      <Logo src='images/justlogo.png' alt='logo' onClick={handleClick} />
      {location.pathname === '/dashboard' && (
        <div style={styles.team}>
          <h1 style={{ margin: 0, color: 'white' }}>{getTeamLabel()}</h1>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        {location.pathname === '/' ? (
          <WrappedHorizontalLoginForm />
        ) : (
          <>
            {location.pathname !== '/team' && <TeamDropdown />}
            <UserPanel />
          </>
        )}
      </div>
    </HeaderWrapper>
  );
}

const styles = {
  team: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: 'white',
    width: '20rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
};
