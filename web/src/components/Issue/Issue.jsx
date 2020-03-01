import React from 'react';
import { WrappedCreateIssueForm as CreatedIssue } from '../CreateIssue/CreateIssue';
import CommentBody from '../Comment/CommentBody';

export default function Issue({ changePage, data, source }) {
  // Bug exclusively if using mySQL
  // if (data && data.tag) {
  //   try {
  //     data.tag = JSON.parse(data.tag);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <CreatedIssue data={data} changePage={changePage} source={source} />
      <CommentBody id={data.id} />
    </div>
  );
}
