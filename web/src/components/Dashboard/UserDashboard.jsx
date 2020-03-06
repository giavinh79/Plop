import React from 'react';
import { Empty } from 'antd';
import DragDropComponent from './DragDropComponent';
import { useActiveIssues } from '../../utility/hooks';

export default function UserDashboard({ changePage, checkSession }) {
  const [items, setItems, loading] = useActiveIssues('user', checkSession);

  const isEmpty = () => {
    try {
      return items.active.length + items.progress.length + items.complete.length === 0;
    } catch (err) {
      return false;
    }
  };

  return isEmpty() && !loading ? (
    <div style={styles.emptyWrapper}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<span style={{ fontSize: '3rem' }}>No issues found</span>}
        imageStyle={styles.emptyImage}
      />
    </div>
  ) : (
    <DragDropComponent changePage={changePage} items={items} setItems={setItems} loading={loading} source={1} />
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
