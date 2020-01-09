import React from 'react';
import { WrappedCreateIssueForm as CreatedIssue } from '../CreateIssue/CreateIssue';
import CommentBody from '../Comment/CommentBody';

export default function Issue({ data, changePage }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <CreatedIssue data={data} changePage={changePage} />
      <CommentBody />
    </div>
  );
}
