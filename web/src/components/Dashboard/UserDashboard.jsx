import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Empty } from 'antd';
import DragDropComponent from './DragDropComponent';
import { API_ENDPOINT } from '../../utility/constants';

export default function UserDashboard({ changePage, checkSession }) {
  const [empty, setEmpty] = useState(localStorage.getItem('empty') != null ? true : false);
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
      let { data } = await axios.get(`${API_ENDPOINT}/userIssue/1`);
      const { activeItems, progressItems, completedItems } = data;
      if (isMounted.current) {
        if (activeItems.length + progressItems.length + completedItems.length === 0) {
          setEmpty(true);
        } else {
          setItems({ active: activeItems, progress: progressItems, complete: completedItems });
        }
        setLoaded(true);
      }
    })().catch(() => {
      checkSession();
    });

    return () => {
      isMounted.current = false;
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
