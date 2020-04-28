import { useEffect, useState, useRef } from 'react';
import { API_ENDPOINT } from '../constants';
import axios from 'axios';
import { isAuthenticated } from './services';

/*
 * Custom Hooks
 */

const useActiveIssues = (type) => {
  //  type denotes whether it is for the Team or User dashboard
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      }
    })().catch((err) => {
      isAuthenticated();
    });

    return () => {
      isMounted.current = false;
    };
  }, [items.complete.length, items.progress.length, items.active.length, type]);

  return [items, setItems, loading];
};

export { useActiveIssues };
