import React from 'react';
import DragDropComponent from './DragDropComponent';
import { useActiveIssues } from '../../utility/hooks';

export default function TeamDashboard() {
  const [items, setItems, loading] = useActiveIssues('team');

  return <DragDropComponent items={items} setItems={setItems} loading={loading} />;
}
