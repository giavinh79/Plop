import React from 'react';
import { List, Typography, Avatar } from 'antd';

const { Text } = Typography;

const data = [
  {
    title: `Dashboard Pages (All & Assigned To Me)`,
    image: '/images/dragndrop.png',
    type: 'home',
    description:
      "This page is used to display current active (non-backlog) issues/tasks along with their stages of progress. The difference between 'All' and 'Assigned To Me' is that 'Assigned To Me' will only display issues directly assigned to you.",
    // content:
    //   "As these dashboards have drag-and-drop functionality built in, users can easily change issue progress stages by holding left click on an issue card and moving it to a certain column. Each issue card shows the task's title and short description along with an information icon at the top right. When clicking this icon, the user will be redirected to the respective task's page.",
  },
  {
    title: `Project Overview Page`,
    image: '/images/dragndrop2.png',
    type: 'line-chart',
    description:
      'This page displays information about the project and statistics regarding tasks. The sprint completion percentage is dependent on completed tasks out of all active tasks.',
  },
  {
    title: `Project Schedule Page`,
    image: '/images/dragndrop2.png',
    type: 'calendar',
    description:
      'This page displays a calendar highlighting the current date and showing information regarding project deadlines. Any issues with a deadline will be displayed on this calendar. Clicking on these issues will open them up in a new tab for viewing.',
  },
  {
    title: `Notes Page`,
    image: '/images/dragndrop4.png',
    type: 'container',
    description:
      "This page is for displaying general notes for the team. The user must be at least administration tier 3 to edit the notes page. More information about creating notes and manipulating the layout can be found by clicking the 'Info' button on the corresponding page.",
  },
  {
    title: `Members Page`,
    image: '/images/dragndrop4.png',
    type: 'user',
    description:
      "This page displays the current members in the team and some of their information. Note that kicking/banning a user from the team will result in all their related room data also being removed (ie. notifications, administration tier). Members with the privileges to kick/ban members will also be able to view the 'Banned Members List' page.",
  },
  {
    title: `Create Issue Page`,
    image: '/images/dragndrop4.png',
    type: 'pull-request',
    description:
      'This page allows users to create new issues. The only required attributes for an issue are the title and short description. For more information on the different properties and attributes of issues and how to manage them in the project, go to section III.',
  },
  {
    title: `Issue Page`,
    image: '/images/dragndrop4.png',
    type: 'pull-request',
    description:
      "This page provides information about a particular issue and is typically accessed by clicking the 'Info' icon on issues in the dashboard or by clicking 'Edit' in the issue tables. You can also share an issue along with custom text to another user by clicking the top-right button.",
  },
  {
    title: `Active and Backlog Table Pages`,
    image: '/images/dragndrop4.png',
    type: 'table',
    description:
      "These pages list issues and their data in a sortable table format. These tables also allow you to directly manipulate issues using the 'Action' column where you can edit, delete, or change the progress of a given issue. In the right-most column, a green icon pointing down represents low priority whereas a red icon pointing up represents major priority.",
  },
  {
    title: `Logs Page`,
    image: '/images/dragndrop4.png',
    type: 'database',
    description:
      "This page displays logs for team activity which are marked with unique colors and icons for quick identification. Further filtering can be done on these logs by using the in-built search bar or through the dropdown. Most of the logs also allow you to navigate to the source by clicking the navigation text or 'Go to' text.",
  },
  {
    title: `Settings Page`,
    image: '/images/dragndrop4.png',
    type: 'setting',
    description:
      'This page displays the settings for the team. This page can only be viewed by members with administration tier 4 and above and can only be edited by members with administration tier 5. In this page, the team owner can also choose to delete the team and corresponding data permanently.',
  },
];

export default function PageSection() {
  return (
    <div style={{ padding: '0 2rem' }}>
      <div>
        <p style={{ fontSize: '1.5rem', fontWeight: 500 }}>
          <Text>Description</Text>
        </p>
        {/* <Text type='secondary' style={{ textIndent: '30px' }}>
          There are 14 different main pages present in the Plop team interface. In the list below, you can find a brief
          description of each of the pages.
        </Text> */}
        {/* <Icon type="twitter" /> */}
      </div>

      <List
        itemLayout='vertical'
        size='large'
        dataSource={data}
        grid={{ gutter: 16, lg: 1, xs: 1, md: 1, xl: 2 }}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            style={{
              display: 'flex',
              flexWrap: 'wrap-reverse',
              padding: '1rem',
              backgroundColor: '#00000003',
              border: '1px solid #e8e8e8',
              minHeight: '13rem',
            }}
            // extra={
            //   <img
            //     width={272}
            //     alt='logo'
            //     src={item.image}
            //     style={{
            //       borderRadius: '20px',
            //       marginBottom: '1.5rem',
            //     }}
            //   />
            // }
          >
            <List.Item.Meta
              avatar={<Avatar icon={item.type} style={{ backgroundColor: '#5885B1' }} />}
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
