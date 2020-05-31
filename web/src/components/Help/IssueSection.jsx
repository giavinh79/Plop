import React from 'react';
import { Typography, Descriptions } from 'antd';
import { Subheader } from './HelpStyles';

const { Text } = Typography;

export default function IssueSection() {
  return (
    <div style={{ padding: '0 2rem' }}>
      <div style={{ paddingBottom: '2rem' }}>
        <Subheader>
          <Text>Description</Text>
        </Subheader>
        <Text type='secondary' style={{ textIndent: '30px' }}>
          Issues are essentially <span style={{ fontWeight: 500 }}>tasks</span> that need to be completed by the team. I
          chose to use the term 'issues' over 'tasks' in order to have similar terminology compared to other popular
          project management tools and methodologies you will likely encounter during your professional software career
          (
          <a href='https://www.atlassian.com/software/jira' target='_blank' rel='noopener noreferrer'>
            Jira
          </a>{' '}
          and the{' '}
          <a href='https://zenkit.com/en/blog/agile-methodology-an-overview/' target='_blank' rel='noopener noreferrer'>
            Agile Methodology
          </a>
          ). There is no limit to the number of issues you may create for your team however it's recommended that only
          issues the team plans on prioritizing are made active (to prevent bloating the dashboard and to keep the
          current project objective more organized). Issues that can be worked on later should be placed in the backlog.
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 2rem 0 2rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <img src='/images/help/dashboard-issue.png' style={{ height: 'auto' }} alt='dashboard task' />
              <p>Example Dashboard Issue</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img
                src='/images/help/dashboard-overdue-issue.png'
                style={{ height: 'auto' }}
                alt='overdue dashboard task'
              />
              <p>Example Overdue Dashboard Issue</p>
            </div>
          </div>
        </Text>
      </div>

      <div style={{ paddingBottom: '2rem' }}>
        <Subheader>
          <Text>States</Text>
        </Subheader>
        <Text type='secondary'>
          Issues ultimately have four different states they may be in. They can be{' '}
          <span style={{ fontWeight: 500 }}>active</span>, <span style={{ fontWeight: 500 }}>in progress</span>,{' '}
          <span style={{ fontWeight: 500 }}>completed</span>, or in the <span style={{ fontWeight: 500 }}>backlog</span>
          . The first three respective states mentioned above are issues considered active in the current{' '}
          <a
            style={{ fontWeight: 500 }}
            href='https://searchsoftwarequality.techtarget.com/definition/Scrum-sprint'
            target='_blank'
            rel='noopener noreferrer'
          >
            sprint/development cycle
          </a>
          . These are issues that will show up in the dashboards and active issues page. Issues in the backlog are for
          tasks that are to be worked on in the future and can only be seen in the backlog issues page. In the future,
          there is a plan on adding a fifth state where deleting issues moves them to an archive with limited data (just
          for future reference). To understand the implications of complete issues, please see the 'Scheduling' help
          section. For a quick summary, deleting issues with a 'complete' status will log that issue as being completed
          which gets reflected in the project overview graph.
        </Text>
      </div>
      <div style={{ paddingBottom: '2rem' }}>
        <Subheader>
          <Text>Interactions</Text>
        </Subheader>
        <Text type='secondary'>
          Active issues (issues with an active, in progress, or complete status) can be manipulated on the dashboards by
          dragging and dropping them in their respective column. By clicking the 'info' icon on each dashboard card, the
          user can find more data regarding that task. On the 'Active Issues' and 'Backlog Issues' tables, users can
          easily change issue statuses, delete them, or edit them. Finally, when on a certain issue's page, users can
          write comments at the bottom (which will notify the assignee if they exist) and also share it with another
          user by using the 'Share' button at the top right of the section.
        </Text>
      </div>
      <Subheader>
        <Text>Properties</Text>
      </Subheader>
      <Text type='secondary'>
        <Descriptions bordered>
          <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Title</span>} span={3}>
            <span style={{ color: 'red' }}>(Required)</span> Title of the issue
          </Descriptions.Item>
          <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Short Description</span>} span={3}>
            <span style={{ color: 'red' }}>(Required)</span> Short description of the issue
          </Descriptions.Item>
          <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Description</span>} span={3}>
            More detailed summary of the issue/task (up to 1000 characters)
          </Descriptions.Item>
          <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Assignee</span>} span={3}>
            User in charge of finishing this task (they will get a notification and this issue will show up in their
            personal dashboard)
          </Descriptions.Item>
          <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Tags</span>} span={3}>
            Labelling the type of issue (for organizational purposes)
          </Descriptions.Item>
          <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Deadline</span>} span={3}>
            Setting when the task should be completed by. Any issues with deadlines will show up on the 'Schedule' page.
            Any tasks still active past this date will look visually different to reflect the fact that it is overdue
            (see help section IV for an example)
          </Descriptions.Item>
          <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Status</span>} span={3}>
            Different statuses to reflect the current state of the issue (explained above in further detail)
          </Descriptions.Item>
          <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Priority</span>} span={3}>
            Quantifies the significance of this issue. On the table pages, depending on the priority value of a given
            issue, there will be either a green or red arrow
          </Descriptions.Item>
        </Descriptions>
      </Text>
    </div>
  );
}
