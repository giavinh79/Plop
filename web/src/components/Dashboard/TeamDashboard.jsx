import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DragDropComponent from './DragDropComponent';

let isMounted = false;
let activeItems = [];
let progressItems = [];
let completedItems = [];

export default function TeamDashboard({ issue, changePage, checkSession }) {
  const { active, progress, complete } = issue;
  if (active || progress || complete) {
    activeItems = active;
    progressItems = progress;
    completedItems = complete;
  }

  const [items, setItems] = useState({
    active: activeItems,
    progress: progressItems,
    complete: completedItems,
  });

  useEffect(() => {
    isMounted = true;

    (async () => {
      let res = await axios.get('/teamIssue/1', { withCredentials: true });
      const { activeItems, progressItems, completedItems } = res.data;
      if (isMounted) {
        if (
          activeItems.length + progressItems.length + completedItems.length > 0 ||
          items.active.length + items.progress.length + items.complete.length > 0
        )
          setItems({ active: activeItems, progress: progressItems, complete: completedItems });
      }
    })().catch(() => {
      checkSession();
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return <DragDropComponent changePage={changePage} items={items} setItems={setItems} />;
}
