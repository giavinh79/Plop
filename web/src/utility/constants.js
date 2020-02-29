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

export const pagination = {
  pageSize: 8,
  hideOnSinglePage: true,
};
