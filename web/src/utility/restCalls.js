/*
 * File for containing all the different HTTP calls to the backend service
 */

import axios from 'axios';
import { API_ENDPOINT } from '../constants';

const clearNotifications = async notifications => {
  try {
    await axios.post(`${API_ENDPOINT}/clearNotifications`, { notifications });
  } catch (err) {
    throw err;
  }
};

const createSession = async event => {
  try {
    await axios.post(`${API_ENDPOINT}/sessionRoom`, {
      id: JSON.parse(localStorage.getItem('teams'))[event.key - 1].id,
    });
  } catch (err) {
    throw err;
  }
};

const createTeam = async data => {
  try {
    return await axios.put(`${API_ENDPOINT}/room`, data);
  } catch (err) {
    throw err;
  }
};

const deleteRoom = async (email, password) => {
  try {
    await axios.delete(`${API_ENDPOINT}/room`, { data: { email: email, password: password } });
  } catch (err) {
    throw err;
  }
};

const joinTeam = async data => {
  try {
    await axios.post(`${API_ENDPOINT}/joinRoom`, data);
  } catch (err) {
    throw err;
  }
};

const retrieveAssignees = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/assignees`);
  } catch (err) {
    throw err;
  }
};

const retrieveMembers = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/members`);
  } catch (err) {
    throw err;
  }
};

const retrieveNotifications = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/notifications`);
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

const sendNotificationsRead = async data => {
  try {
    await axios.post(`${API_ENDPOINT}/notifications`, data);
  } catch (err) {
    throw err;
  }
};

const deleteIssue = async id => {
  try {
    await axios.delete(`${API_ENDPOINT}/issue/${id}`);
  } catch (err) {
    throw err;
  }
};

export {
  clearNotifications,
  createSession,
  createTeam,
  deleteIssue,
  deleteRoom,
  joinTeam,
  retrieveAssignees,
  retrieveMembers,
  retrieveNotifications,
  retrieveTeams,
  sendNotificationsRead,
};
