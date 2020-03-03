import React from 'react';
import { Dropdown, Icon, Menu } from 'antd';
import { UserPanelWrapper } from '../style';
import { Redirect } from 'react-router-dom';
import UserSettings from './UserSettings';
import axios from 'axios';
import { API_ENDPOINT } from '../../../utility/constants';

export default class UserPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userModal: false,
      toHomepage: false,
    };
  }

  displayUserModal = condition => {
    this.setState({ userModal: condition });
  };

  handleLogout = async () => {
    await axios.post(`${API_ENDPOINT}/logout`).catch();
    localStorage.clear(); // get rid of team caching and other vars
    this.setState({ toHomepage: true });
  };

  menu = (
    <Menu>
      <Menu.Item key='0'>
        <p
          style={{ margin: 0 }}
          onClick={() => {
            this.displayUserModal(true);
          }}
        >
          Settings
        </p>
      </Menu.Item>
      <Menu.Item key='1'>
        <p style={{ margin: 0, color: '#ccc' }}>Themes</p>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='2'>
        <p
          onClick={() => {
            this.handleLogout();
          }}
          style={{ margin: 0 }}
        >
          Logout
        </p>
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
            {/* <p style={styles.text}>exampleuser@gmail.com</p> */}
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
