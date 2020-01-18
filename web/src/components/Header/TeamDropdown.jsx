import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';
import 'antd/dist/antd.css';
import './style.css';

export default function TeamDropdown() {
  const [toTeam, setToTeam] = useState(false);
  const [loading, setLoading] = useState(false);

  const displayLoading = () => {
    setLoading(true);
    setTimeout(function() {
      try {
        setLoading(false);
      } catch (err) {}
    }, 1200);

    // send request to session endpoint and change the team
    // force redirect to /dashboard to refresh or better, find a way just so that the dashboard component recalls the API
  };

  const menu = (
    <Menu id='dropdownMenu'>
      <Menu.Item
        key='0'
        onClick={() => {
          setToTeam(!toTeam);
        }}
      >
        <Icon type='appstore' />
        Overview
      </Menu.Item>
      {localStorage.getItem('teams') == null
        ? null
        : JSON.parse(localStorage.getItem('teams')).map((team, index) => {
            return (
              <Menu.Item
                key={index + 1}
                onClick={team => {
                  displayLoading();
                }}
              >
                <Icon type='team' />
                {team.name}
              </Menu.Item>
            );
          })}
    </Menu>
  );
  return toTeam ? (
    <Redirect push to='/team' />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Icon
        type='loading'
        style={{ display: loading ? 'block' : 'none', color: 'white', fontSize: '1.4rem', marginLeft: '0.7rem' }}
        spin
      />
      <Dropdown.Button
        overlay={menu}
        style={{ margin: '0 1.3rem 0 1rem' }}
        icon={<Icon type='switcher' />}
        onClick={() => {
          setToTeam(true);
        }}
      >
        Switch Team
      </Dropdown.Button>
    </div>
  );
}
