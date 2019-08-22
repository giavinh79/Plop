import React from 'react'
import { Redirect } from 'react-router-dom'
import { Menu, Dropdown, Icon } from 'antd'
import 'antd/dist/antd.css'
import './style.css'

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
  constructor(props) {
    super(props)
    this.state = {
      toTeam: false
    }
  }

  render() {
    return !this.state.toTeam ?
      <Dropdown.Button overlay={menu} style={{ margin: '0 1.3rem 0 1.7rem' }} icon={<Icon type="switcher" />} onClick={() => { this.setState({ toTeam: true }) }}>
        Switch Team
      </Dropdown.Button> : <Redirect push to="/team" />
  }
}