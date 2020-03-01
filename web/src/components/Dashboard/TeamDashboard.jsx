import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DragDropComponent from './DragDropComponent';
import { API_ENDPOINT } from '../../utility/constants';

export default function TeamDashboard({ changePage, checkSession }) {
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState({
    active: [],
    progress: [],
    complete: [],
  });

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    (async () => {
      let { data } = await axios.get(`${API_ENDPOINT}/teamIssue/1`);
      const { activeItems, progressItems, completedItems } = data;
      if (isMounted.current) {
        setItems({ active: activeItems, progress: progressItems, complete: completedItems });
        setLoaded(true);
      }
    })().catch(err => {
      checkSession();
    });

    return () => {
      isMounted.current = false;
    };
  }, [checkSession, items.complete.length, items.progress.length, items.active.length]);
  return <DragDropComponent changePage={changePage} items={items} setItems={setItems} loaded={loaded} />;
}
