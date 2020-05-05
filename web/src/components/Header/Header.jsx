import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Badge, Icon } from 'antd';
import UserPanel from './UserPanel/UserPanel';
import Notification from './Notification/Notification';
import { HeaderWrapper, Logo } from './style.js';
import { displaySimpleNotification } from '../../utility/services';
import { WrappedHorizontalLoginForm } from './LoginForm.jsx';
import { retrieveNotifications } from '../../utility/restCalls';
import TeamDropdown from './TeamDropdown';
import { ThemeContext } from '../../colors/theme';
import { LogoText, MobileLogoText, TeamWrapper } from './HeaderStyles';

export default function Header() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [theme] = useContext(ThemeContext);
  let history = useHistory();
  let { location } = history;

  useEffect(() => {
    if (location.pathname.substring(0, 10) === '/dashboard') {
      (async () => {
        let { data } = await retrieveNotifications();
        setNotifications(data);
      })().catch((err) => {
        displaySimpleNotification(
          'Error',
          2,
          'bottomRight',
          `Unable to retrieve notifications ${err}.`,
          'warning',
          'red'
        );
      });
    }
  }, [location.pathname, refresh]);

  const isNewNotifications = () => {
    for (let item of notifications) {
      if (item.status === 0) return true;
    }
    return false;
  };

  const handleClick = () => {
    if (location.pathname !== '/') {
      history.push('/team');
    }
  };

  const getTeamLabel = () => {
    try {
      for (let item of JSON.parse(localStorage.getItem('teams'))) {
        if (item.id.toString() === JSON.parse(localStorage.getItem('currentTeam')).id) {
          return item.name;
        }
      }
    } catch (err) {
      return '';
    }
  };

  return (
    <HeaderWrapper
      lightmode={theme.isLightMode ? 1 : 0}
      homepage={location.pathname === '/' ? 1 : 0}
      style={location.pathname === '/' ? { backgroundColor: '#445D66', padding: '1rem 13rem 0 13rem' } : {}}
    >
      <div style={{ display: 'flex', padding: location.pathname === '/team' ? '0 1rem' : '0' }}>
        {location.pathname === '/team' && <LogoText>PL</LogoText>}
        <Logo
          src='/images/justlogo.png'
          alt='logo'
          onClick={handleClick}
          homepage={location.pathname === '/' ? 1 : 0}
          style={{ padding: location.pathname === '/team' ? 0 : '0 1rem' }}
        />
        {location.pathname === '/' && <MobileLogoText>Plop</MobileLogoText>}
        {location.pathname === '/team' && <LogoText>P</LogoText>}
      </div>
      {location.pathname.substring(0, 10) === '/dashboard' && (
        <TeamWrapper>
          <h1 style={{ margin: 0, color: 'white' }}>{getTeamLabel()}</h1>
        </TeamWrapper>
      )}

      <div className='login-form-wrapper'>
        {location.pathname === '/' ? (
          <WrappedHorizontalLoginForm />
        ) : (
          <>
            {location.pathname !== '/team' && (
              <>
                {showNotificationModal && (
                  <Notification
                    data={notifications}
                    setNotificationData={setNotifications}
                    setShowNotificationModal={setShowNotificationModal}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                )}
                <Badge count={isNewNotifications() ? 1 : 0} dot style={{ cursor: 'pointer', backgroundColor: 'red' }}>
                  <Icon
                    type='bell'
                    theme='filled'
                    style={{ fontSize: '20px', marginLeft: '1rem', color: theme.isLightMode ? '' : '#cfecfd' }}
                    onClick={() => setShowNotificationModal(true)}
                  />
                </Badge>
                <TeamDropdown />
              </>
            )}
            <UserPanel />
          </>
        )}
      </div>
    </HeaderWrapper>
  );
}
