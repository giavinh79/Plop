import React from 'react'
import { Icon, notification } from 'antd'

// File for using commonly used functions - simply import the one desired

export const displayNotification = (status, messageOne, messageTwo) => {
  notification.open({
    message: status ? 'Success' : 'Error',
    duration: 2,
    placement: 'bottomRight',
    description: status ? messageOne : messageTwo,
    icon: <Icon type={status ? 'smile' : 'warning'} style={{ color: status !== null ? '#108ee9' : 'red' }} />,
  })
}