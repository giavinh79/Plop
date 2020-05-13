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
    content: 'The graph can be further manipulated to show more detailed statitics such as',
  },
  {
    title: `Project Schedule Page`,
    image: '/images/dragndrop2.png',
    description:
      'This page displays a calendar highlighting the current date and showing information regarding project deadlines.',
    content: 'The graph can be further manipulated to show more detailed statitics such as',
  },
  {
    title: `Notes Page`,
    image: '/images/dragndrop4.png',
    description: 'This page displays general notes for the team.',
    content: 'The graph can be further manipulated to show more detailed statitics such as',
  },
  {
    title: `Members Page`,
    image: '/images/dragndrop4.png',
    description: 'This page displays the current members in the team and some of their information.',
    content:
      'Note that kicking/banning a user from the team will result in all their related room data also being removed (ie. notifications, administration tier).',
  },
  {
    title: `Create Issue Page`,
    image: '/images/dragndrop4.png',
    description: 'This page displays information about the project and statistics regarding tasks.',
    content: 'The graph can be further manipulated to show more detailed statitics such as',
  },
  {
    title: `Active Table Page`,
    image: '/images/dragndrop4.png',
    description: 'This page displays information about the project and statistics regarding tasks.',
    content: 'The graph can be further manipulated to show more detailed statitics such as',
  },
  {
    title: `Backlog Table Page`,
    image: '/images/dragndrop4.png',
    description: 'This page displays information about the project and statistics regarding tasks.',
    content: 'The graph can be further manipulated to show more detailed statitics such as',
  },
  {
    title: `Logs Page`,
    image: '/images/dragndrop4.png',
    description: 'This page displays information about the project and statistics regarding tasks.',
    content: 'The graph can be further manipulated to show more detailed statitics such as',
  },
  {
    title: `Settings Page`,
    image: '/images/dragndrop4.png',
    description: 'This page displays information about the project and statistics regarding tasks.',
    content: 'The graph can be further manipulated to show more detailed statitics such as',
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
