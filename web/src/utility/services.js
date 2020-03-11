import React from 'react';
import { Icon, notification, Modal } from 'antd';

/*
 * Commonly used functions
 */

const displayInfoDialog = (title, dataLabel, data, content) => {
  Modal.info({
    title: title,
    content: (
      <div>
        <div>
          {dataLabel}
          <div style={{ padding: '0.5rem', border: '1px solid #ccc', margin: '0.5rem 0' }}>
            <em>{data}</em>
          </div>
        </div>
        <p>{content}</p>
      </div>
    ),
  });
};

const displaySimpleNotification = (message, duration, placement, description, icon, iconColor) => {
  notification.open({
    message,
    duration,
    placement,
    description,
    icon: <Icon type={icon} style={{ color: iconColor }} />,
  });
};

const displaySessionExpired = () => {
  notification.open({
    message: 'Session expired',
    duration: 3,
    placement: 'bottomRight',
    description: 'You need to login again.',
    icon: <Icon type='warning' style={{ color: '#108ee9' }} />,
  });
};

const displayUnknownError = () => {
  notification.open({
    message: 'Error occured',
    duration: 15,
    placement: 'bottomRight',
    description: 'Unknown Error. Contact plopwebapp@gmail.com.',
    icon: <Icon type='warning' style={{ color: '#108ee9' }} />,
  });
};

export { displayInfoDialog, displaySimpleNotification, displaySessionExpired, displayUnknownError };
