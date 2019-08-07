import React from 'react'
import { Dropdown, Icon, Menu } from 'antd'
import { UserPanelWrapper } from './style';

const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="/">Settings</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="/">Logout</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Help</Menu.Item>
    </Menu>
  );

export default class UserPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <UserPanelWrapper>
                    <div style={styles.iconWrapper}><Icon type="user" style={{fontSize: '1.3rem', color: '#506271'}} /></div>
                    <p style={styles.text}>exampleuser@gmail.com</p>
                    <Icon type="caret-down" style={{color: '#3e3e3e'}}/>
                </UserPanelWrapper>
            </Dropdown>
        )
    }
}

const styles = {
    iconWrapper : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.2rem',
        height: '2.2rem',
        backgroundColor: 'white',
        padding: '0.5rem',
        marginRight: '0.7rem',
        borderRadius: '50%'
    },
    text : {
        margin: '0 0.3rem 0 0'
    }
}