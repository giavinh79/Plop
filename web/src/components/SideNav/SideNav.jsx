import React, { useContext, useEffect, useState } from 'react';
import { Menu, Icon, Tooltip } from 'antd';
import { ThemeContext } from '../../colors/theme';
import { withRouter, useHistory } from 'react-router-dom';
import { getRepository } from '../../utility/restCalls';
import 'antd/dist/antd.css';
import './SideNav.css';

const { SubMenu } = Menu;
let navigationMap = {
  '/dashboard': ['1'],
  '/dashboard/user': ['2'],
  '/dashboard/overview': ['3'],
  '/dashboard/schedule': ['4'],
  '/dashboard/notes': ['5'],
  '/dashboard/members': ['6'],
  '/dashboard/manage-members': ['7'],
  '/dashboard/create-issue': ['8'],
  '/dashboard/active-issues': ['9'],
  '/dashboard/backlog-issues': ['10'],
  '/dashboard/archive-issues': ['11'],
  '/dashboard/logs': ['12'],
  '/dashboard/settings': ['13'],
  '/dashboard/help': ['14'],
};

function SideNav({ path }) {
  const [repository, setRepository] = useState('https://github.com');
  const [theme] = useContext(ThemeContext);
  const history = useHistory();
  let selectedNavigation = navigationMap[path] || ['1'];

  useEffect(() => {
    (async () => {
      let { data } = await getRepository();
      setRepository(data.repository || 'https://github.com');
    })().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <Menu
      theme={theme.isLightMode ? 'light' : 'dark'} // change second option to dark once theme design completed
      style={{ width: 256, minHeight: '100%', backgroundColor: theme.isLightMode ? 'white' : '#1A2330' }}
      defaultOpenKeys={['sub1']}
      mode='inline'
      defaultSelectedKeys={selectedNavigation}
    >
      <SubMenu
        key='sub1'
        title={
          <span>
            <Icon type='home' />
            <span>Dashboard</span>
          </span>
        }
      >
        <Menu.ItemGroup key='g1' title='Filter'>
          <Menu.Item key='1' onClick={() => history.push('/dashboard')}>
            {/* <a href='/dashboard/' style={{ color: 'rgba(0, 0, 0, 0.65)' }} onClick={(e) => e.preventDefault()}></a> */}
            All
          </Menu.Item>
          <Menu.Item key='2' onClick={() => history.push('/dashboard/user')}>
            Assigned To Me
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup key='g2' title='Analytics'>
          <Menu.Item key='3' onClick={() => history.push('/dashboard/overview')}>
            <Tooltip title='Set of graphs and data for issues' mouseEnterDelay={0.8}>
              Project Overview
            </Tooltip>
          </Menu.Item>
          <Menu.Item key='4' onClick={() => history.push('/dashboard/schedule')}>
            Schedule
          </Menu.Item>
        </Menu.ItemGroup>
      </SubMenu>
      <Menu.Item key='5' onClick={() => history.push('/dashboard/notes')}>
        <Icon type='container' />
        Notes
      </Menu.Item>
      <SubMenu
        key='sub3'
        title={
          <span>
            <Icon type='user' />
            <span>Members</span>
          </span>
        }
      >
        <Menu.Item key='6' onClick={() => history.push('/dashboard/members')}>
          View
        </Menu.Item>
        <SubMenu key='sub4' title='Admin Panel'>
          <Menu.Item key='7' onClick={() => history.push('/dashboard/manage-members')}>
            Manage Members
          </Menu.Item>
        </SubMenu>
      </SubMenu>
      <SubMenu
        key='sub5'
        title={
          <span>
            <Icon type='pull-request' />
            <Tooltip title='Project tasks' mouseEnterDelay={0.8}>
              <span>Issues</span>
            </Tooltip>
          </span>
        }
      >
        <Menu.Item key='8' onClick={() => history.push('/dashboard/create-issue')}>
          Create
        </Menu.Item>
        <Menu.Item key='9' onClick={() => history.push('/dashboard/active-issues')}>
          Active
        </Menu.Item>
        <Menu.Item key='10' onClick={() => history.push('/dashboard/backlog-issues')}>
          <Tooltip title='Repository for future tasks' mouseEnterDelay={0.8}>
            <span>Backlog</span>
          </Tooltip>
        </Menu.Item>
        <Menu.Item key='11' onClick={() => history.push('/dashboard/archive-issues')}>
          <Tooltip title='Repository for completed tasks' mouseEnterDelay={0.8}>
            <span>Archive</span>
          </Tooltip>
        </Menu.Item>
      </SubMenu>
      <Menu.Item
        key='sub6'
        onClick={() => {
          window.open(repository, '_blank');
        }}
      >
        <Icon type='github' />
        Repository
      </Menu.Item>
      <Menu.Item key='12' onClick={() => history.push('/dashboard/logs')}>
        <Icon type='database' />
        Logs
      </Menu.Item>
      <Menu.Item key='13' onClick={() => history.push('/dashboard/settings')}>
        <Icon type='setting' />
        Settings
      </Menu.Item>
      <Menu.Item key='14' onClick={() => history.push('/dashboard/help')}>
        <Icon type='question-circle' />
        Help
      </Menu.Item>
    </Menu>
  );
}

export default withRouter(SideNav);
