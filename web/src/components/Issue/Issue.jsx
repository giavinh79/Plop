import React from 'react';
import { WrappedCreateIssueForm as CreatedIssue } from '../CreateIssue/CreateIssue';
import CommentBody from '../Comment/CommentBody';

export default function Issue({ data, changePage }) {
  // Bug exclusively if using mySQL or postgres
  // if (data && data.tag) {
  //   try {
  //     data.tag = JSON.parse(data.tag);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <CreatedIssue data={data} changePage={changePage} />
      <CommentBody id={data.id} />
    </div>
  );
}
