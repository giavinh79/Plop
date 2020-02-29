import React, { useEffect, useState } from 'react';
import { Empty } from 'antd';
import axios from 'axios';
import DragDropComponent from './DragDropComponent';
import { API_ENDPOINT } from '../../utility/constants';

let isMounted = false;
let activeItems = [];
let progressItems = [];
let completedItems = [];

export default function UserDashboard({ issue, changePage, checkSession }) {
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

  // const filter = useRef(false); // investigate why I had this again - think i was trying to cache locally for faster perceived speeds
  const [empty, setEmpty] = useState(localStorage.getItem('empty') !== null ? true : false);

  useEffect(() => {
    isMounted = true;

    (async () => {
      let res = await axios.get(`${API_ENDPOINT}/userIssue/1`, { withCredentials: true });
      const { activeItems, progressItems, completedItems } = res.data;
      if (isMounted) {
        if (activeItems.length + progressItems.length + completedItems.length === 0) {
          setEmpty(true);
          localStorage.setItem('empty', '1');
        } else {
          setItems({ active: activeItems, progress: progressItems, complete: completedItems });
          localStorage.removeItem('empty');
        }
        setLoaded(true);
      }
    })().catch(() => {
      checkSession();
    });

    return () => {
      isMounted = false;
    };
  }, [checkSession]);

  return empty ? (
    <div style={styles.emptyWrapper}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<span style={{ fontSize: '3rem' }}>No issues found</span>}
        imageStyle={styles.emptyImage}
      />
    </div>
  ) : (
    <DragDropComponent changePage={changePage} items={items} setItems={setItems} loaded={loaded} />
  );
}

const styles = {
  emptyWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
    width: '100%',
  },
  emptyImage: {
    height: '10rem',
    paddingBottom: '2rem',
  },
};
