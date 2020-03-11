/* Code Constants
 * Variables which control various FE properties
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

// Max pages for issues tables
export const pagination = {
  pageSize: 8,
  hideOnSinglePage: true,
};

/* Configuration Variables
 * For configuring project to work in different ways
 *
 */

export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT ? '' : 'https://plopwebapp.herokuapp.com';

/* String Constants
 * Variables mapped to various hardcoded messages and text seen by client
 *
 */
