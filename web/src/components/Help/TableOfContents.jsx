import React from 'react';
import { Divider } from 'antd';
import { SectionNavHeader, Table, NavText } from './HelpStyles';

export default function TableOfContents({ setPage, page }) {
  return (
    <Table>
      <h2 style={{ margin: '1rem 0 1.5rem 0rem', fontWeight: 700, color: '#2c343e' }}>Table of Contents</h2>
      <SectionNavHeader>- Introduction -</SectionNavHeader>
      <NavText onClick={() => setPage(0)} bold={page === 0 ? 1 : 0}>
        Overview
      </NavText>
      <NavText onClick={() => setPage(1)} bold={page === 1 ? 1 : 0}>
        Pages
      </NavText>
      <Divider />
      <SectionNavHeader>- Issues -</SectionNavHeader>
      <NavText onClick={() => setPage(2)} bold={page === 2 ? 1 : 0}>
        Description
      </NavText>
      <NavText onClick={() => setPage(3)}>Properties</NavText>
      <NavText onClick={() => setPage(4)}>States</NavText>
      <Divider />
      <SectionNavHeader>- Settings -</SectionNavHeader>
      <NavText onClick={() => setPage(5)}>Team Settings</NavText>
      <NavText onClick={() => setPage(6)}>User Settings</NavText>
      <Divider />
      <SectionNavHeader>- Project Scheduling -</SectionNavHeader>
      <NavText onClick={() => setPage(7)}>Scheduling</NavText>
      <NavText onClick={() => setPage(8)}>Calendar</NavText>
      <Divider />
      <SectionNavHeader>- Logs -</SectionNavHeader>
      <NavText onClick={() => setPage(9)}>Description</NavText>
      <NavText onClick={() => setPage(10)}>Categorizing</NavText>
    </Table>
  );
}
