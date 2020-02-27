import React from 'react';
import { Icon, notification, Modal } from 'antd';

/*
 * File for using commonly used functions - simply import the one desired
 */

const displayInfoDialog = (title, dataLabel, data, content) => {
  Modal.info({
    title: title,
    content: (
      <div>
        <p>
          {dataLabel}
          <div style={{ padding: '0.5rem', border: '1px solid #ccc', margin: '0.5rem 0' }}>
            <em>{data}</em>
          </div>
        </p>
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
    duration: 2,
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

// Using export { } over export const to give quick summary of utility functions
export { displayInfoDialog, displaySimpleNotification, displaySessionExpired, displayUnknownError };
