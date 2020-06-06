import React from 'react';
import { Typography } from 'antd';
import { Subheader } from './HelpStyles';

const { Text } = Typography;

export default function HelpScheduleSection() {
  return (
    <div style={{ padding: '0 2rem' }}>
      <div style={{ paddingBottom: '2rem' }}>
        <Subheader>
          <Text>Introduction</Text>
        </Subheader>
        <Text type='secondary' style={{ textIndent: '30px' }}>
          As explained by{' '}
          <a
            href='https://www.atlassian.com/agile/tutorials/how-to-do-scrum-with-jira-software'
            target='_blank'
            rel='noopener noreferrer'
          >
            Jira
          </a>
          , in Scrum (a type of agile methodology), teams forecast to complete a set of user stories or other work items
          during a fixed time duration, known as a sprint. Generally speaking, sprints are one, two, or four weeks long.
          It's up to the team to determine the length of a sprint — we recommend starting with two weeks. That's long
          enough to get something accomplished, but not so long that the team isn't getting regular feedback. Once a
          sprint cadence is determined, the team perpetually operates on that cadence. Fixed length sprints reinforce
          estimation skills and predict the future velocity for the team as they work through the backlog.
        </Text>
      </div>

      <div style={{ paddingBottom: '2rem' }}>
        <Subheader>
          <Text>Description</Text>
        </Subheader>
        <Text type='secondary' style={{ textIndent: '30px' }}>
          Scheduling in Plop is done using issue deadlines and the 'Check' icon next to the text 'Completed' on the
          dashboard. Scheduling is quite simplistic and limited in the application at the moment, where users "create"
          sprints by making issues active and advancing them over time to completed status by their deadline. Once the
          development cycle is done, a user "completes" the sprint by clicking the 'Check' icon. The user can then
          optionally provide a name (ie. Sprint 1 or Sprint Sign-up Flow) which will go into the team logs. In the
          future, more advanced scheduling is planned where users will be able to create sprints easily from backlog
          issues and start/end/combine them/set timeframes effortlessly. In addition, users will be able to create
          issues directly on the schedule page (for easy deadline scheduling), assign them to sprints, and drag them to
          different dates within the given sprint's timeframe.
        </Text>
      </div>
    </div>
  );
}
