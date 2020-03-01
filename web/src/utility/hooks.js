import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '../utility/constants';

/*
 * Custom Hooks
 */

const useActiveIssues = (type, checkSession) => {
  //  type denotes whether it is for the Team or User dashboard
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
      let { data } = await axios.get(`${API_ENDPOINT}/${type}Issue/1`);
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

  return [items, setItems, loaded];
};

export { useActiveIssues };
