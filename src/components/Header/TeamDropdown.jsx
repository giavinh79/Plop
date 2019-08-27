import React from 'react'
import { Redirect } from 'react-router-dom'
import { Menu, Dropdown, Icon } from 'antd'
import 'antd/dist/antd.css'
import './style.css'

const displayLoading = () => {
  document.querySelector('#loading').style.display = 'block';
  setTimeout(function () { document.querySelector('#loading').style.display = 'none'; }, 1200);
  // send request to session endpoint and change the team
  // force redirect to /dashboard to refresh or better, find a way just so that the dashboard component recalls the API
}

const menu = (
  <Menu onClick={() => { }} id="dropdownMenu">
    <Menu.Item key="0">
      <Icon type="appstore" />
      Overview
    </Menu.Item>
    {JSON.parse(localStorage.getItem('teams')).map((team, index) => {
      return (
        <Menu.Item key={index + 1} onClick={(team) => { displayLoading() }}>
          <Icon type="team" />
          {team.name}
        </Menu.Item>)
    })}
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon id='loading' type='loading' style={{ display: 'none', color: 'white', fontSize: '1.4rem', marginLeft: '0.7rem' }} spin />
        <Dropdown.Button overlay={menu} style={{ margin: '0 1.3rem 0 1rem' }} icon={<Icon type="switcher" />} onClick={() => { this.setState({ toTeam: true }) }}>
          Switch Team
        </Dropdown.Button>
      </div> : <Redirect push to="/team" />
  }
}