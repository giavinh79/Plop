import React from 'react';
import { Icon, notification } from 'antd';

/*
 * File for using commonly used functions - simply import the one desired
 */

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

// Using export { } over export const to give quick summary of utility functions
export { displaySimpleNotification, displaySessionExpired };
