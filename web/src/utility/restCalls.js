/*
 * File for containing all the different HTTP calls to the backend service
 */

import axios from 'axios';
import { API_ENDPOINT } from './constants';

const retrieveAssignees = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/assignees`);
  } catch (err) {
    throw err;
  }
};

const retrieveTeams = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/room`);
  } catch (err) {
    throw err;
  }
};

export { retrieveAssignees, retrieveTeams };
