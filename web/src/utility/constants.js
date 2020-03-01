/*
 * File for containing all the different constants and configuration variables
 */

export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT ? '' : 'https://plopwebapp.herokuapp.com';

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

export const progressMap = { 1: 'Active', 2: 'In Progress', 3: 'Completed' };

export const pagination = {
  pageSize: 8,
  hideOnSinglePage: true,
};
