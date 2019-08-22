import React from 'react'
import 'antd/dist/antd.css'
import { Menu, Dropdown, Icon } from 'antd'
import './style.css';

const menu = (
  <Menu onClick={() => { }} id="dropdownMenu">
    <Menu.Item key="1">
      <Icon type="appstore" />
      Overview
            </Menu.Item>
    <Menu.Item key="2">
      <Icon type="team" />
      NCR
            </Menu.Item>
    <Menu.Item key="3">
      <Icon type="team" />
      Side Projectors
            </Menu.Item>
  </Menu>
);

export default class TeamDropdown extends React.Component {
  render() {
    return (
      <Dropdown.Button overlay={menu} style={{ margin: '0 1.3rem 0 1.7rem' }} icon={<Icon type="switcher" />}>
        Switch Team
      </Dropdown.Button>
    )
  }
}