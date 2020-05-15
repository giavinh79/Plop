import React from 'react';
import { List, Typography, Icon, Avatar } from 'antd';

const { Text } = Typography;

const data = [
  {
    title: `Dashboard Team Pages (All & Assigned To Me)`,
    image: '/images/dragndrop.png',
    description:
      "This page is used to display current active (non-backlog) issues/tasks along with their stages of progress. The difference between 'All' and 'Assigned To Me' is that 'Assigned To Me' will only display issues directly assigned to you.",
    content:
      "As these dashboards have drag-and-drop functionality built in, users can easily change issue progress stages by holding left click on an issue card and moving it to a certain column. Each issue card shows the task's title and short description along with an information icon at the top right. When clicking this icon, the user will be redirected to the respective task's page.",
  },
  {
    title: `Project Overview Page`,
    image: '/images/dragndrop2.png',
    description: 'This page displays information about the project and statistics regarding tasks.',
    content: 'The sprint completion percentage is dependent on completed tasks out of all active tasks.',
  },
  {
    title: `Project Schedule Page`,
    image: '/images/dragndrop2.png',
    description:
      'This page displays a calendar highlighting the current date and showing information regarding project deadlines.',
    content:
      'Any issues with a deadline will be displayed on this calendar. Clicking on these issues will open them up in a new tab for viewing.',
  },
  {
    title: `Notes Page`,
    image: '/images/dragndrop4.png',
    description: 'This page is for displaying general notes for the team.',
    content:
      "The user must be at least administration tier 3 to edit the notes page. More information about creating notes and manipulating the layout can be found by clicking the 'Info' button on the corresponding page.",
  },
  {
    title: `Members Page`,
    image: '/images/dragndrop4.png',
    description: 'This page displays the current members in the team and some of their information.',
    content:
      "Note that kicking/banning a user from the team will result in all their related room data also being removed (ie. notifications, administration tier). Members with the privileges to kick/ban members will also be able to view the 'Banned Members List' page.",
  },
  {
    title: `Create Issue Page`,
    image: '/images/dragndrop4.png',
    description: 'This page allows users to create issues for the team.',
    content:
      'The only required attributes for an issue is the title and short description. The assignee is used to assign the issue to someone (they will also receive a notification for this) and have it show up on their personal user dashboard. The deadline field allows the team to organize when issues need be done by, issues still active past this date will have visual cues showing that they are overdue. Tags and priorities are used to categorize issues. Users can also upload a total of 5 images related to the issue.',
  },
  {
    title: `Issue Page`,
    image: '/images/dragndrop4.png',
    description: 'This page provides information about a particular issue.',
    content:
      "This page is typically accessed by clicking the 'INfo' icon on issues in the dashboard or by clicking 'Edit' in the issue tables. Although this page is almost visually identical to the 'Create Issue Page', there are some differences such as being able to share this issue directly by the top-right button to another user with custom text.",
  },
  {
    title: `Active and Backlog Table Pages`,
    image: '/images/dragndrop4.png',
    description: "These pages list issues' data in a table format.",
    content:
      "On top of giving information about the issue title, description, tags, and status, these tables also allow you to directly manipulate issues using the 'ACtion' column. In this column, you can edit, delete, or quickly change the progress of a given issue. In the right-most column, a green icon pointing down represents low priority for that issue whereas a red icon pointing up represents high priority.",
  },
  {
    title: `Logs Page`,
    image: '/images/dragndrop4.png',
    description: 'This page displays logs for team activity.',
    content:
      "These logs are marked with unique colors and icons for quick identification. Further filtering can be done on these logs by using the in-built search bar or through the dropdown. Most of the logs also allow you to navigate to the source by clicking the navigation text or 'Go to' text.",
  },
  {
    title: `Settings Page`,
    image: '/images/dragndrop4.png',
    description: 'This page displays the settings for the team.',
    content:
      'This page can only be viewed by members with administration tier 4 and above and can only be edited by members with administration tier 5. In this page, the team owner can also choose to delete the team and corresponding data permanently.',
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
        // footer={
        //   <div>
        //     <b>Dashboard Page </b> (all)
        //   </div>
        // }
        renderItem={(item) => (
          <List.Item
            key={item.title}
            style={{
              display: 'flex',
              flexWrap: 'wrap-reverse',
              padding: '1rem',
              backgroundColor: '#00000003',
              border: '1px solid #e8e8e8',
              marginBottom: '1.5rem',
            }}
            extra={
              <img
                width={272}
                alt='logo'
                src={item.image}
                style={{
                  borderRadius: '20px',
                  marginBottom: '1.5rem',
                }}
              />
            }
          >
            <List.Item.Meta
              // avatar={<Avatar src={item.avatar} />}
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    </div>
  );
}
