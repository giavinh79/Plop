import React from 'react';
import { layout, subheader } from '../../globalStyles';
import { Col, Divider, Row } from 'antd';

export default function Help() {
  return (
    <Col type='flex'>
      <div style={layout}>
        <p style={subheader}>Help</p>
        <div>
          Plop is an application that allows users to collaborate and manage projects within a small team. For any
          questions, concerns, or feedback please email plopwebapp@gmail.com.
        </div>
        <Row type='flex' style={{ flexWrap: 'nowrap' }}>
          <div style={styles.table}>
            <h2 style={{ marginTop: '1rem' }}>Table of Contents</h2>
            <div>
              <Divider style={{ margin: '10px 0' }} />
              <h3>Introduction</h3>
              <a href='/'>
                <p>Description</p>
              </a>
            </div>
            <div>
              <Divider />
              <h3>Issues</h3>
              <a href='/'>
                <p>Description</p>
              </a>
              <a href='/'>
                <p>Properties</p>
              </a>
              <a href='/'>
                <p>States</p>
              </a>
            </div>
            <div>
              <Divider />
              <h3>Settings</h3>
              <a href='/'>
                <p>Team settings</p>
              </a>
              <a href='/'>
                <p>User settings</p>
              </a>
            </div>
            <div>
              <Divider />
              <h3>Administration</h3>
              <a href='/'>
                <p>Managing Members</p>
              </a>
              <a href='/'>
                <p>Tier of Privileges</p>
              </a>
            </div>
          </div>
          <div style={{ margin: '1rem' }}>
            <img
              src='images/plopdark.png'
              style={{ maxWidth: '100%', borderRadius: '10px', height: 'auto' }}
              alt='plop dark mode web app'
            />
          </div>
        </Row>
      </div>
      <Row style={{ padding: '2rem', height: '40rem', backgroundColor: 'rgba(204, 214, 232, 0.62)' }}>
        <h1 style={styles.sectionHeader}>Introduction</h1>
      </Row>
      <Row style={{ padding: '2rem', height: '40rem' }}>
        <h1 style={styles.sectionHeader}>Issues/Tasks</h1>
      </Row>
      <Row style={{ padding: '2rem', height: '40rem', backgroundColor: '#c9dfec' }}>
        <h1 style={styles.sectionHeader}>Settings</h1>
      </Row>
    </Col>
  );
}

const styles = {
  table: {
    border: '1px solid #ccc',
    padding: '0.5rem 1rem',
    margin: '1rem 1rem 1rem 0',
    minWidth: '15rem',
    borderRadius: '10px',
  },
  sectionHeader: {
    fontFamily: 'Montserrat',
    fontWeight: 700,
    fontSize: '3rem',
  },
};
