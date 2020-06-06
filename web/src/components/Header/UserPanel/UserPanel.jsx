import React from 'react';
import { Redirect } from 'react-router-dom';
import { Dropdown, Icon, Menu } from 'antd';
import { UserPanelWrapper } from '../style';
import UserSettings from './UserSettings';
import { logout } from '../../../utility/restCalls';
import { displaySimpleNotification } from '../../../utility/services';

export default class UserPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userModal: false,
      toHomepage: false,
    };
  }

  displayUserModal = (condition) => {
    this.setState({ userModal: condition });
  };

  handleLogout = async () => {
    await logout().catch((err) => {
      displaySimpleNotification('Error', 5, 'bottomRight', `Log out was unsuccessful. ${err}`, 'warning', 'red');
    });
    localStorage.clear(); // get rid of team caching and other vars
    this.setState({ toHomepage: true });
  };

  menu = (
    <Menu>
      <Menu.Item
        key='0'
        onClick={() => {
          this.displayUserModal(true);
        }}
      >
        <p style={{ margin: 0 }}>Settings</p>
      </Menu.Item>
      <Menu.Item key='1' disabled>
        <p style={{ margin: 0, color: '#ccc' }}>Update</p>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key='2'
        onClick={() => {
          this.handleLogout();
        }}
      >
        <p style={{ margin: 0 }}>Logout</p>
      </Menu.Item>
    </Menu>
  );

  render() {
    return this.state.toHomepage ? (
      <Redirect push to='/' />
    ) : (
      <>
        {this.state.userModal && <UserSettings displayUserModal={this.displayUserModal} />}
        <Dropdown overlay={this.menu} trigger={['click']}>
          <UserPanelWrapper>
            <div style={styles.iconWrapper}>
              <Icon type='user' style={{ fontSize: '1.3rem', color: '#506271' }} />
            </div>
            <Icon type='caret-down' style={{ color: '#3e3e3e' }} />
          </UserPanelWrapper>
        </Dropdown>
      </>
    );
  }
}

const styles = {
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.2rem',
    height: '2.2rem',
    backgroundColor: 'white',
    padding: '0.5rem',
    marginRight: '0.5rem',
    borderRadius: '50%',
  },
  text: {
    margin: '0 0.3rem 0 0',
  },
};
