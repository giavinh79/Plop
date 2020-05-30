import React from 'react';
import DragDropComponent from './DragDropComponent';
import { useActiveIssues } from '../../utility/hooks';

export default function TeamDashboard() {
  const [items, loading, newRequest, setNewRequest] = useActiveIssues('team');

  return (
    <DragDropComponent
      itemsData={items}
      loading={loading}
      newRequest={newRequest}
      setNewRequest={setNewRequest}
      type='team'
    />
  );
}
