/* Exports constants and config variables */

import React from 'react';
import { Select } from 'antd';
export * from './notes';

/* Table Constants
 *
 */

export const progressMap = { 1: 'Active', 2: 'In Progress', 3: 'Completed' };

export const tagMap = {
  bug: 'volcano',
  database: 'green',
  frontend: 'blue',
  backend: 'orange',
  testing: 'purple',
  security: 'red',
  documentation: 'gold',
  research: 'gray',
};

export const tagSuggestions = [
  <Select.Option key='Backend'>Backend</Select.Option>,
  <Select.Option key='Bug'>Bug</Select.Option>,
  <Select.Option key='Database'>Database</Select.Option>,
  <Select.Option key='DevOps'>DevOps</Select.Option>,
  <Select.Option key='Documentation'>Documentation</Select.Option>,
  <Select.Option key='Frontend'>Frontend</Select.Option>,
  <Select.Option key='Research'>Research</Select.Option>,
  <Select.Option key='Security'>Security</Select.Option>,
  <Select.Option key='Testing'>Testing</Select.Option>,
];

export const pagination = {
  pageSize: 8,
  hideOnSinglePage: true,
};

export const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

/* Configuration Variables
 * For configuring project to work in different ways
 *
 */

export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT ? '' : 'https://plopwebapp.herokuapp.com';
export const WEB_SOCKET = process.env.REACT_APP_WS_ENDPOINT || 'wss://plopwebapp.herokuapp.com';

/* String Constants
 * Variables mapped to various hardcoded messages and text seen by client
 *
 */
