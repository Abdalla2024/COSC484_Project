// API service for handling MongoDB operations
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

export const fetchMessages = async (userId, otherUserId) => {
  const response = await axios.get(`${API_URL}/api/messages/${userId}/${otherUserId}`);
  return response.data;
};

export const sendMessage = async (senderId, receiverId, content) => {
  console.log('Sending message:', { senderId, receiverId, content });
  try {
    const response = await fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId, content }),
    });
    const data = await response.json();
    console.log('Send message response:', data);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (userId, otherUserId) => {
  console.log('Marking messages as read between:', userId, 'and', otherUserId);
  try {
    const response = await fetch(`${API_URL}/api/messages/read/${userId}/${otherUserId}`, {
      method: 'PUT',
    });
    const data = await response.json();
    console.log('Mark messages as read response:', data);
    return data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

export const getUnreadMessageCount = async (userId) => {
  const response = await axios.get(`${API_URL}/api/messages/unread/${userId}`);
  return response.data;
};

export const syncUser = async (userData) => {
  console.log('Syncing user with data:', userData);
  try {
    const response = await fetch(`${API_URL}/api/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log('User sync response:', data);
    return data;
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error;
  }
};

export const getConversations = async (userId) => {
  console.log('Fetching conversations for user:', userId);
  try {
    const response = await fetch(`${API_URL}/api/users`);
    const users = await response.json();
    console.log('All users:', users);
    return users.filter(user => user.firebaseId !== userId);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const getMessages = async (userId, otherUserId) => {
  console.log('Fetching messages between:', userId, 'and', otherUserId);
  try {
    const response = await fetch(`${API_URL}/api/messages/${userId}/${otherUserId}`);
    const messages = await response.json();
    console.log('Messages response:', messages);
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const getUnreadCount = async (userId, otherUserId) => {
  console.log('Getting unread count for user:', userId, 'from:', otherUserId);
  try {
    const response = await fetch(`${API_URL}/api/messages/unread/${userId}/${otherUserId}`);
    const data = await response.json();
    console.log('Unread count response:', data);
    return data;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
}; 