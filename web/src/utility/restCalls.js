/*
 * File for containing all the different HTTP calls to the backend service
 * Export statement at the bottom for summary of calls
 */

import axios from 'axios';
import { API_ENDPOINT } from '../constants';

// This function catches errors thrown from axios calls and handles the response object to the frontend
const handleErrorResponse = (err) => {
  // switch (err.message) {
  //   case ERROR_SESSION_INVALID:
  //     throw SESSION_INVALID_MESSAGE; // i.e. String constant containing "User is not authenticated."
  //     break;
  //   default:
  //     throw err(UNKNOWN_ERROR);
  // }
};

// Confirm user is logged in
const checkAuth = async () => {
  try {
    return await axios.post(`${API_ENDPOINT}/session`);
  } catch (err) {
    throw err;
  }
};

const clearNotifications = async (notifications) => {
  try {
    await axios.post(`${API_ENDPOINT}/clearNotifications`, { notifications });
  } catch (err) {
    throw err;
  }
};

const createSession = async (event) => {
  try {
    await axios.post(`${API_ENDPOINT}/sessionRoom`, {
      id: JSON.parse(localStorage.getItem('teams'))[event.key - 1].id,
    });
  } catch (err) {
    throw err;
  }
};

const createTeam = async (data) => {
  try {
    return await axios.put(`${API_ENDPOINT}/room`, data);
  } catch (err) {
    throw err;
  }
};

const deleteIssue = async (id) => {
  try {
    await axios.delete(`${API_ENDPOINT}/issue/${id}`);
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

const getAvatar = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/avatar`);
  } catch (err) {
    throw new err();
  }
};

const getIssueById = async (issue) => {
  try {
    return await axios.get(`${API_ENDPOINT}/issue/${issue}`);
  } catch (err) {
    throw err;
  }
};

const getChat = async (issue) => {
  try {
    return await axios.get(`${API_ENDPOINT}/chats`);
  } catch (err) {
    throw err;
  }
};

const getRepository = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/repository`);
  } catch (err) {
    throw new err();
  }
};

const joinTeam = async (data) => {
  try {
    return await axios.post(`${API_ENDPOINT}/joinRoom`, data);
  } catch (err) {
    throw err;
  }
};

const logout = async () => {
  try {
    await axios.post(`${API_ENDPOINT}/logout`);
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

const sendNotificationsRead = async (data) => {
  try {
    await axios.post(`${API_ENDPOINT}/notifications`, data);
  } catch (err) {
    throw err;
  }
};

const sendShareIssueNotification = async (issue, issueId, message, users) => {
  try {
    await axios.post(`${API_ENDPOINT}/shareIssue`, { issue, issueId, message, users });
  } catch (err) {
    throw err;
  }
};

const updateIssue = async (id, status) => {
  try {
    await axios.post(`${API_ENDPOINT}/issueProgress`, { id: id, status: status });
  } catch (err) {
    throw err;
  }
};

export {
  checkAuth,
  clearNotifications,
  createSession,
  createTeam,
  deleteIssue,
  deleteRoom,
  getAvatar,
  getChat,
  getIssueById,
  getRepository,
  joinTeam,
  logout,
  retrieveAssignees,
  retrieveMembers,
  retrieveNotifications,
  retrieveTeams,
  sendShareIssueNotification,
  sendNotificationsRead,
  updateIssue,
};
