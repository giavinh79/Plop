import { useEffect, useState, useRef } from 'react';
import { isAuthenticated } from './services';
import { getIssues } from './restCalls';

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
  const [newRequest, setNewRequest] = useState(true);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    (async () => {
      let { data } = await getIssues(type);
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
  }, [items.complete.length, items.progress.length, items.active.length, type, newRequest]);

  return [items, loading, newRequest, setNewRequest];
};

export { useActiveIssues };
