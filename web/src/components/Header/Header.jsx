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
    if (location.pathname !== '/home') {
      history.push('/team');
    }
  };

  return (
    <HeaderWrapper style={{ backgroundColor: location.pathname === '/home' ? '#445D66' : '#79B7D4' }}>
      <Logo src='images/justlogo.png' alt='logo' onClick={handleClick} />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        {location.pathname === '/home' ? (
          <WrappedHorizontalLoginForm />
        ) : (
          <>
            {location.pathname === '/team' ? null : <TeamDropdown />}
            <UserPanel />
          </>
        )}
      </div>
    </HeaderWrapper>
  );
}
