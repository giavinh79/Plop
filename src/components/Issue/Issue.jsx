import React from 'react'
import { WrappedCreateIssueForm as CreatedIssue } from '../CreateIssue/CreateIssue'
import CommentBody from '../Comment/CommentBody'

export default function Issue(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <CreatedIssue data={props.data} changePage={props.changePage} />
      <CommentBody />
    </div>
  )
}