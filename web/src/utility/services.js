import React from 'react';
import { Icon, notification, Modal } from 'antd';
import { checkAuth } from './restCalls';

/*
 * Commonly used geneeral functions
 */

const isAuthenticated = async () => {
  try {
    await checkAuth();
    return true;
  } catch (err) {
    displaySessionExpired();
    return false;
  }
};

const isJSONString = (item) => {
  try {
    JSON.parse(item);
    return true;
  } catch (err) {
    return false;
  }
};

// Returns true if issues are overdue (ie. 1 day behind)
const compareDates = (deadline) => {
  function getMonth(date) {
    let month = date.getUTCMonth() + 1;
    return month < 10 ? '0' + month : '' + month;
  }

  function getDay(date) {
    let day = date.getUTCDate() + 1;
    return day < 10 ? '0' + day : '' + day;
  }

  const deadlineObj = new Date(deadline);
  deadlineObj.setMinutes(deadlineObj.getMinutes() - new Date().getTimezoneOffset());
  const deadlineDate = parseInt(deadlineObj.getUTCFullYear().toString() + getMonth(deadlineObj) + getDay(deadlineObj));

  const todayObj = new Date();
  const todayDate = parseInt(todayObj.getUTCFullYear().toString() + getMonth(todayObj) + getDay(todayObj));

  return deadlineDate < todayDate;
};

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

const displayErrorNotification = (text) => {
  displaySimpleNotification(
    'Error',
    2,
    'bottomRight',
    text,
    'warning',
    'red'
  );
}

const displaySessionExpired = () => {
  notification.open({
    message: 'Session expired',
    duration: 3,
    placement: 'bottomRight',
    description: 'You need to login again.',
    icon: <Icon type='warning' style={{ color: '#108ee9' }} />,
  });
};

const displayUnknownError = (err) => {
  notification.open({
    message: 'Error occured',
    duration: 15,
    placement: 'bottomRight',
    description: `An unknown error has occured: ${err}. Please refresh the page and try again. If there is still an error, contact the help desk.`,
    icon: <Icon type='warning' style={{ color: '#108ee9' }} />,
  });
};

export {
  isAuthenticated,
  isJSONString,
  compareDates,
  displayInfoDialog,
  displaySimpleNotification,
  displayErrorNotification,
  displaySessionExpired,
  displayUnknownError,
};
