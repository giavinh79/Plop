import React from 'react';
import { Empty } from 'antd';
import DragDropComponent from './DragDropComponent';
import { useActiveIssues } from '../../utility/hooks';

export default function UserDashboard() {
  const [items, loading, newRequest, setNewRequest] = useActiveIssues('user');

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
    <DragDropComponent
      itemsData={items}
      loading={loading}
      newRequest={newRequest}
      setNewRequest={setNewRequest}
      source={1}
      type='user'
    />
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
