import React, { useState } from 'react';
import { Breadcrumb, Row } from 'antd';
import { layout } from '../../globalStyles';
import IntroductionSection from './IntroductionSection';
// import TableOfContents from './TableOfContents';
import PageSection from './PageSection';
import TableOfContentsTest from './TableOfContentsTest';
import IssueSection from './IssueSection';

const mapPageToText = {
  0: { section: 'Introduction', subSection: 'Overview' },
  1: { section: 'Introduction', subSection: 'Pages' },
  2: { section: '', subSection: 'Issues' },
  3: { section: '', subSection: 'Chat' },
  4: { section: '', subSection: 'User Settings' },
  5: { section: '', subSection: 'Team Settings' },
  6: { section: '', subSection: 'Analytics' },
  7: { section: '', subSection: 'Scheduling' },
  8: { section: '', subSection: 'Logs' },
};

/* Controls rendering of information in help section
 * No routing needed so instead just use changePage()
 */
export default function HelpPanel() {
  const [page, setPage] = useState(0);

  const changePage = (type) => {
    switch (type) {
      case 0:
        return <IntroductionSection />;
      case 1:
        return <PageSection />;
      case 2:
        return <IssueSection />;
      default:
        return <IntroductionSection />;
    }
  };

  const setSectionAddress = (page) => {
    const { section, subSection } = mapPageToText[page];

    return (
      <>
        {/* <Breadcrumb.Item>
          <span>{section}</span>
        </Breadcrumb.Item>   */}
        <Breadcrumb.Item>
          <span>{subSection}</span>
        </Breadcrumb.Item>
      </>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={layout}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <span>Help</span>
          </Breadcrumb.Item>
          {setSectionAddress(page)}
        </Breadcrumb>
        <p style={{ fontSize: '2.4rem', margin: '1rem 0', textAlign: 'center' }}>{mapPageToText[page].subSection}</p>

        <Row type='flex' style={{ justifyContent: 'flex-end', padding: '1rem 0' }}>
          <TableOfContentsTest setPage={setPage} page={page} />
          <div style={{ flex: 1 }}>{changePage(page)}</div>
          {/* <TableOfContents setPage={setPage} page={page} /> */}
        </Row>
      </div>
    </div>
  );
}
