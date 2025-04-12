// API service for handling MongoDB operations
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchMessages = async (userId, otherUserId) => {
  const response = await axios.get(`${API_URL}/messages/${userId}/${otherUserId}`);
  return response.data;
};

export const sendMessage = async (sender, receiver, content) => {
  const response = await axios.post(`${API_URL}/messages`, { sender, receiver, content });
  return response.data;
};

export const markMessagesAsRead = async (userId, otherUserId) => {
  const response = await axios.put(`${API_URL}/messages/read/${userId}/${otherUserId}`);
  return response.data;
};

export const getUnreadMessageCount = async (userId) => {
  const response = await axios.get(`${API_URL}/messages/unread/${userId}`);
  return response.data;
}; 