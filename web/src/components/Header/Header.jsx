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
import ThemeContext from '../../Theme';
import { LogoText } from './HeaderStyles';

export default function Header() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const theme = useContext(ThemeContext);
  let history = useHistory();
  let { location } = history;

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      (async () => {
        let { data } = await retrieveNotifications();
        setNotifications(data);
      })().catch(err => {
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
        if (item.id.toString() === localStorage.getItem('currentTeam')) {
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
      style={location.pathname === '/' ? { backgroundColor: '#445D66' } : {}}
    >
      <div style={{ display: 'flex', padding: location.pathname === '/team' ? '0 1rem' : '0' }}>
        {location.pathname === '/team' && <LogoText>PL</LogoText>}
        <Logo
          src='/images/justlogo.png'
          alt='logo'
          onClick={handleClick}
          style={{ padding: location.pathname === '/team' ? 0 : '0 1rem' }}
        />
        {location.pathname === '/team' && <LogoText>P</LogoText>}
      </div>
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
                    style={{ fontSize: '20px', cursor: 'pointer' }}
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
