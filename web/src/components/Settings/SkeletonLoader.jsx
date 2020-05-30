import React from 'react';
import { Skeleton } from 'antd';

export default function SkeletonLoader() {
  return (
    <Skeleton
      active
      paragraph={{ rows: 1, width: '100%', style: { marginTop: '12px' } }}
      title={{ width: '10rem', style: { marginTop: '1rem' } }}
    />
  );
}
