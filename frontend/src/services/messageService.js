const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3000';

export const createMessage = async (senderId, receiverId, content) => {
  try {
    const response = await fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        senderId,
        receiverId,
        content
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create message: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Failed to create message: ' + error.message);
  }
};

export const getMessages = async (userId, otherUserId) => {
  try {
    const response = await fetch(`${API_URL}/api/messages/${userId}/${otherUserId}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get messages: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to get messages: ' + error.message);
  }
};

export const markMessagesAsRead = async (userId, otherUserId) => {
  try {
    const response = await fetch(`${API_URL}/api/messages/read/${userId}/${otherUserId}`, {
      method: 'PUT',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to mark messages as read: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw new Error('Failed to mark messages as read: ' + error.message);
  }
};

export const getUnreadMessageCount = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/messages/unread/count/${userId}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get unread message count: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw new Error('Failed to get unread message count: ' + error.message);
  }
}; 