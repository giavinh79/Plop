
import React from 'react'
import 'antd/dist/antd.css'
import { Menu, Icon } from 'antd'

const { SubMenu } = Menu;
export default class Sider extends React.Component {
  render() {
    return (
      <Menu
        style={{ width: 256, minHeight: '100%' }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="home" />
              <span>Dashboard</span>
            </span>
          }
        >
          <Menu.ItemGroup key="g1" title="Filter">
            <Menu.Item key="1" onClick={() => this.props.handlePageChange(0)}>All</Menu.Item>
            <Menu.Item key="2">Assigned To Me</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup key="g2" title="Analytics">
            <Menu.Item key="3">Option 3</Menu.Item>
            <Menu.Item key="4">Option 4</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span>
              <Icon type="user" />
              <span>Members</span>
            </span>
          }
        >
          <Menu.Item key="5">View</Menu.Item>
          <SubMenu key="sub3" title="Admin Panel">
            <Menu.Item key="7">Manage members</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu
          key="sub4"
          title={
            <span>
              <Icon type="pull-request" />
              <span>Issues</span>
            </span>
          }
        >
          <Menu.Item key="9">Active</Menu.Item>
          <Menu.Item key="10" onClick={() => {this.props.handlePageChange(4)}}>Backlog</Menu.Item>
          <Menu.Item key="11">Archive</Menu.Item>
        </SubMenu>
        <Menu.Item key="sub5" onClick={() => {window.open('https://github.com/GV79/Plop', '_blank')}}>
            <Icon type="github"/>
            GitHub
        </Menu.Item>
      </Menu>
    );
  }
}