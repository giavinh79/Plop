import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export default function IssueSection() {
  return (
    <div style={{ padding: '0 2rem' }}>
      <div style={{ paddingBottom: '2rem' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 500 }}>
          <Text>Description</Text>
        </p>
        <Text type='secondary' style={{ textIndent: '30px' }}>
          Issues are essentially tasks that need to be completed by the team. I chose to use the term 'issues' over
          'tasks' in order to have similar terminology compared to other popular project management tools and
          methodologies you will likely encounter during your professional software career (
          <a href='https://www.atlassian.com/software/jira' target='_blank' rel='noopener noreferrer'>
            Jira
          </a>{' '}
          and the{' '}
          <a href='https://zenkit.com/en/blog/agile-methodology-an-overview/' target='_blank' rel='noopener noreferrer'>
            Agile Methodology
          </a>
          ). There is no limit to the number of issues you may create for your team however it's recommended that only
          issues the team plans on prioritizing are made active (to prevent bloating the dashboard and to keep your the
          current project objective more organized). Issues that can be worked on later should consequently be placed
          into the backlog.
        </Text>
      </div>

      <p style={{ fontSize: '1.5rem', fontWeight: 500 }}>
        <Text>Properties</Text>
      </p>
      <Text type='secondary'>
        The assignee is used to assign the issue to someone (they will also receive a notification for this) and have it
        show up on their personal user dashboard. The deadline field allows the team to organize when issues need be
        done by, issues still active past this date will have visual cues showing that they are overdue. Tags and
        priorities are used to categorize issues. Users can also upload a total of 5 images related to the issue
      </Text>
      <p style={{ fontSize: '1.5rem', fontWeight: 500 }}>
        <Text>States</Text>
      </p>
      <Text type='secondary'>
        Issues ultimately have four different states they may be in. They can be active, in progress, completed, or in
        the backlog. The first three respective states mentioned In the future, there is a plan on adding a fifth state
        where deleting issues moves them to an archive with limited data (just for future reference).
      </Text>
    </div>
  );
}
