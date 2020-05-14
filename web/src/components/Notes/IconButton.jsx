import React from 'react';
import { Button, Tooltip } from 'antd';

export default function IconButton({ icon, disabled, loading, functionToExecute, nomargin, title }) {
  return (
    <Tooltip title={title}>
      <Button
        type='primary'
        shape='circle'
        icon={icon}
        size={'large'}
        onClick={() => functionToExecute()}
        style={{ marginLeft: nomargin ? 0 : '1rem' }}
        disabled={disabled}
        loading={loading}
      />
    </Tooltip>
  );
}
