import React, { useContext } from 'react';
import { Menu, Icon, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import './style.css';
import { ThemeContext } from '../../colors/theme';

const { SubMenu } = Menu;
function SideNav({ handlePageChange }) {
  const [theme] = useContext(ThemeContext);

  return (
    <Menu
      theme={theme.isLightMode ? 'light' : 'light'} // change second option to dark once theme design completed
      style={{ width: 256, minHeight: '100%' }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode='inline'
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
          <Menu.Item key='1' onClick={() => handlePageChange(0)}>
            All
          </Menu.Item>
          <Menu.Item key='2' onClick={() => handlePageChange(1)}>
            Assigned To Me
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup key='g2' title='Analytics'>
          <Menu.Item key='3' onClick={() => handlePageChange(2)}>
            <Tooltip title='Set of graphs and data for issues' mouseEnterDelay={0.8}>
              Project Overview
            </Tooltip>
          </Menu.Item>
          <Menu.Item key='4' onClick={() => handlePageChange(3)}>
            Schedule
          </Menu.Item>
        </Menu.ItemGroup>
      </SubMenu>
      <SubMenu
        key='sub2'
        title={
          <span>
            <Icon type='user' />
            <span>Members</span>
          </span>
        }
      >
        <Menu.Item key='5' onClick={() => handlePageChange(4)}>
          View
        </Menu.Item>
        <SubMenu key='sub3' title='Admin Panel'>
          <Menu.Item key='6'>Manage Members</Menu.Item>
        </SubMenu>
      </SubMenu>
      <SubMenu
        key='sub4'
        title={
          <span>
            <Icon type='pull-request' />
            <Tooltip title='Project tasks' mouseEnterDelay={0.8}>
              <span>Issues</span>
            </Tooltip>
          </span>
        }
      >
        <Menu.Item key='8' onClick={() => handlePageChange(5)}>
          Create
        </Menu.Item>
        <Menu.Item key='9' onClick={() => handlePageChange(6)}>
          Active
        </Menu.Item>
        <Menu.Item key='10' onClick={() => handlePageChange(7)}>
          <Tooltip title='Repository for future tasks' mouseEnterDelay={0.8}>
            <span>Backlog</span>
          </Tooltip>
        </Menu.Item>
        <Menu.Item key='11' onClick={() => handlePageChange(8)}>
          <Tooltip title='Repository for completed tasks' mouseEnterDelay={0.8}>
            <span>Archive</span>
          </Tooltip>
        </Menu.Item>
      </SubMenu>
      <Menu.Item
        key='sub5'
        onClick={() => {
          window.open('https://github.com', '_blank');
        }}
      >
        <Icon type='github' />
        Repository
      </Menu.Item>
      <Menu.Item key='sub6' onClick={() => handlePageChange(9)}>
        <Icon type='database' />
        Logs
      </Menu.Item>
      <Menu.Item key='sub7' onClick={() => handlePageChange(10)}>
        <Icon type='setting' />
        Settings
      </Menu.Item>
      <Menu.Item key='sub8' onClick={() => handlePageChange(12)}>
        <Icon type='question-circle' />
        Help
      </Menu.Item>
    </Menu>
  );
}

export default React.memo(SideNav);
