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

// Using export { } over export const to give quick summary of utility functions
export { displaySimpleNotification };
