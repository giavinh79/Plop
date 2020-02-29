import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DragDropComponent from './DragDropComponent';
import { API_ENDPOINT } from '../../utility/constants';

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

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    isMounted = true;

    (async () => {
      let res = await axios.get(`${API_ENDPOINT}/teamIssue/1`);
      const { activeItems, progressItems, completedItems } = res.data;
      if (isMounted) {
        if (
          activeItems.length + progressItems.length + completedItems.length > 0 ||
          items.active.length + items.progress.length + items.complete.length > 0
        )
          setItems({ active: activeItems, progress: progressItems, complete: completedItems });
        setLoaded(true);
      }
    })().catch(err => {
      checkSession();
    });

    return () => {
      isMounted = false;
    };
  }, [checkSession, items.complete.length, items.progress.length, items.active.length]);
  return <DragDropComponent changePage={changePage} items={items} setItems={setItems} loaded={loaded} />;
}
