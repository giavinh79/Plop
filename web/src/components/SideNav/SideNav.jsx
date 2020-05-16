import React, { useContext, useEffect, useState } from 'react';
import { Menu, Icon, Tooltip } from 'antd';
import { ThemeContext } from '../../colors/theme';
import { withRouter, useHistory } from 'react-router-dom';
import { getRepository, getRoomAdminTiers } from '../../utility/restCalls';
import './SideNav.css';

const { SubMenu } = Menu;

function SideNav({ path }) {
  let navigationMap = {
    '/dashboard': ['1'],
    '/dashboard/user': ['2'],
    '/dashboard/overview': ['3'],
    '/dashboard/schedule': ['4'],
    '/dashboard/notes': ['5'],
    '/dashboard/members': ['6'],
    '/dashboard/members-banned': ['7'],
    '/dashboard/create-issue': ['8'],
    '/dashboard/active-issues': ['9'],
    '/dashboard/backlog-issues': ['10'],
    '/dashboard/archive-issues': ['11'],
    '/dashboard/logs': ['12'],
    '/dashboard/settings': ['13'],
    '/dashboard/help': ['14'],
  };

  const [repository, setRepository] = useState('https://github.com');
  const [adminTier, setAdminTier] = useState(1);
  const [theme] = useContext(ThemeContext);
  const history = useHistory();
  let selectedNavigation = navigationMap[path] || ['1'];

  useEffect(() => {
    (async () => {
      let { data } = await getRepository();
      setRepository(data.repository || 'https://github.com');
      let {
        data: { administration_level },
      } = await getRoomAdminTiers();
      setAdminTier(administration_level);
    })().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <Menu
      theme={theme.isLightMode ? 'light' : 'dark'}
      style={{ width: 256, minHeight: '100%', backgroundColor: theme.isLightMode ? 'white' : '#1A2330' }}
      defaultOpenKeys={['sub1']}
      mode='inline'
      defaultSelectedKeys={selectedNavigation}
      selectedKeys={selectedNavigation}
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
            {/* 
              If enabling support for right-click in side nav new tab, use Link react-router tags instead
              <a href='/dashboard/' onClick={(e) => e.preventDefault()}></a> 
            */}
            All
          </Menu.Item>
          <Menu.Item key='2' onClick={() => history.push('/dashboard/user')}>
            Assigned To Me
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup key='g2' title='Analytics'>
          <Menu.Item key='3' onClick={() => history.push('/dashboard/overview')}>
            <Tooltip title='Data and graphs concerning project' mouseEnterDelay={0.8}>
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
        <Menu.Item key='7' onClick={() => history.push('/dashboard/members-banned')} disabled={adminTier <= 3}>
          Banned Members
        </Menu.Item>
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
        <Menu.Item key='11' onClick={() => history.push('/dashboard/archive-issues')} disabled>
          <Tooltip title='Deleted tasks organized by sprint' mouseEnterDelay={0.8}>
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
      <Menu.Item key='13' onClick={() => history.push('/dashboard/settings')} disabled={adminTier <= 2}>
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
