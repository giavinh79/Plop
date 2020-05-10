import React from 'react';
import { Breadcrumb, Divider, List, Row, Typography } from 'antd';
import { layout } from '../../globalStyles';
import { SectionNavHeader, Table } from './HelpStyles';

const { Text } = Typography;

/* Controls rendering of information in help section
 * No routing needed so instead I just use changePage()
 */
export default function HelpPanel() {
  const changePage = (type) => {
    switch (type) {
      case 0:
        return <div></div>;
      default:
        return <div></div>;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={layout}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <span>Help</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href=''>Introduction</a>
          </Breadcrumb.Item>
          {/* <Breadcrumb.Item>
            <a href=''>Description</a>
          </Breadcrumb.Item> */}
        </Breadcrumb>
        <p style={{ fontSize: '2.4rem', margin: '1rem 0', textAlign: 'center' }}>Introduction (incomplete)</p>

        <Row type='flex' style={{ flexWrap: 'nowrap', justifyContent: 'flex-end', padding: '1rem 0' }}>
          <div style={{ padding: '0 2rem' }}>
            <div style={{ paddingBottom: '2rem' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 500 }}>
                <Text>Description</Text>
              </p>
              <Text type='secondary' style={{ textIndent: '30px' }}>
                Plop is an application that allows teams to collaborate and manage projects. After signing up, the user
                can choose to create a team or join a team. In total, a user can only be a member of a total of three
                different teams at any given time. Upon entering a team, the sidebar on the left can be used for
                navigation. In total, there are 14 different pages team members can leverage for project management. At
                the bottom right of the interface, the user can access the team chat to communicate in real time with
                other online users. In the top bar, or the header, there are clickable icons and info for the user's
                convenience. At the top left, the user can see the name of the team. To the rop right, the user can
                access team notifications, user settings, and a useful dropdown for quickly changing teams. For any
                questions, concerns, or feedback about the application itself please email{' '}
                <Text code>plopwebapp@gmail.com</Text>.
              </Text>
              {/* <Icon type="twitter" /> */}
            </div>

            <p style={{ fontSize: '1.5rem', fontWeight: 500 }}>
              <Text>Administration Tiers</Text>
            </p>
            <Text type='secondary'>
              There are five different administration tiers you may configure for each user, these go from 1-5. Each
              tier has all the permissions of the tiers below it and more. They can be directly edited for each user in
              the members page and in the team settings page, you can configure the default administration tier for
              newly joined users. The administration tiers go as follows:
            </Text>
            <List
              title='Administration Tiers'
              itemLayout='horizontal'
              style={{ padding: '2rem' }}
              dataSource={[
                {
                  title: 'Tier 1',
                  description: 'User can see all issues but only edit issues directly assigned to them.',
                },
                {
                  title: 'Tier 2',
                  description: 'User can see and edit any issue.',
                },
                {
                  title: 'Tier 3',
                  description:
                    'User can edit team notes and invite new members (if room is restricted to invite-only).',
                },
                {
                  title: 'Tier 4',
                  description: 'User can manage team by banning/kicking/promoting members.',
                },
                {
                  title: 'Tier 5',
                  description:
                    'User can edit team settings. However, only the creator of the team can delete the team. Inactive teams will be automatically deleted after a year.',
                },
                {
                  title: 'Tier 6 *',
                  description: 'This user is the creator of the team and cannot be kicked/banned by other members.',
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href='https://ant.design'>{item.title}</a>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </div>
          <Table>
            <h2 style={{ margin: '1rem 0 1.5rem 0', fontWeight: 700, color: '#2c343e' }}>Table of Contents</h2>
            <div>
              {/* <Divider style={{ margin: '10px 0' }} /> */}
              <SectionNavHeader>Introduction</SectionNavHeader>
              <a href='/dashboard/help' style={{ color: '#6f6f6f' }}>
                <p>Description</p>
              </a>
            </div>
            <div>
              <Divider />
              <SectionNavHeader>Issues</SectionNavHeader>
              {/* <Row type='flex'> */}
              <a href='/dashboard/help' style={{ color: '#6f6f6f' }}>
                <p>Description</p>
              </a>
              {/* <Icon type='swap-right' /> */}
              {/* </Row> */}
              <a href='/dashboard/help' style={{ color: '#6f6f6f' }}>
                <p>Properties</p>
              </a>
              <a href='/dashboard/help' style={{ color: '#6f6f6f' }}>
                <p>States</p>
              </a>
            </div>
            <div>
              <Divider />
              <SectionNavHeader>Settings</SectionNavHeader>
              <a href='/dashboard/help' style={{ color: '#6f6f6f' }}>
                <p>Team Settings</p>
              </a>
              <a href='/dashboard/help' style={{ color: '#6f6f6f' }}>
                <p>User Settings</p>
              </a>
            </div>
            <div>
              <Divider />
              <SectionNavHeader>Project Scheduling</SectionNavHeader>
              <a href='/dashboard/help' style={{ color: '#6f6f6f' }}>
                <p>Scheduling</p>
              </a>
              <a href='/dashboard/help' style={{ color: '#6f6f6f' }}>
                <p>Calendar</p>
              </a>
            </div>
            <div>
              <Divider />
              <SectionNavHeader>Logs</SectionNavHeader>
              <a href='/dashboard/help' style={{ color: '#6f6f6f' }}>
                <p>Description</p>
              </a>
              <a href='/dashboard/help' style={{ color: '#6f6f6f' }}>
                <p>Categorizing</p>
              </a>
            </div>
          </Table>
        </Row>
      </div>
    </div>
  );
}
