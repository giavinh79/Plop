import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Badge, Icon } from 'antd';
import UserPanel from './UserPanel/UserPanel';
import Notification from './Notification/Notification';
import { HeaderWrapper, Logo } from './style.js';
import { displayErrorNotification } from '../../utility/services';
import { retrieveNotifications } from '../../utility/restCalls';
import TeamDropdown from './TeamDropdown';
import { ThemeContext } from '../../colors/theme';
import { TeamWrapper } from './HeaderStyles';

export default function HeaderDashboardPage() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [theme] = useContext(ThemeContext);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const { data } = await retrieveNotifications();
      setNotifications(data);
    })().catch((err) => {
      displayErrorNotification(`Unable to retrieve notifications ${err}.`);
    });
  }, []);

  const existsNewNotifications = () => {
    return notifications.some((notification) => notification.status === 0);
  };

  const handleClick = () => {
    history.push('/team');
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
    <HeaderWrapper theme={theme} homepage={false}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0' }} onClick={() => history.push('/')}>
        <Logo
          src='/images/justlogo.png'
          alt='logo'
          onClick={handleClick}
          homepage={false}
          style={{ padding: '0 1rem' }}
        />
      </div>
      <TeamWrapper>
        <h1 style={{ margin: 0, color: 'white' }}>{getTeamLabel()}</h1>
      </TeamWrapper>

      <div className='login-form-wrapper'>
        <>
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
            <Badge count={existsNewNotifications() ? 1 : 0} dot style={{ cursor: 'pointer', backgroundColor: 'red' }}>
              <Icon
                type='bell'
                theme='filled'
                style={{ fontSize: '20px', marginLeft: '1rem', color: theme.isLightMode ? '' : '#cfecfd' }}
                onClick={() => setShowNotificationModal(true)}
              />
            </Badge>
            <TeamDropdown />
          </>
          <UserPanel />
        </>
      </div>
    </HeaderWrapper>
  );
}
