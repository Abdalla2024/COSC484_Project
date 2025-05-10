const API_URL = 'http://localhost:3000/api';

export const conversationService = {
  createConversation: async (users) => {
    try {
      console.log('Attempting to create a conversation between', users);

      const response = await fetch(`${API_URL}/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({users})
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create conversation');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  getAllConversations: async (userID) => {
    try {
      await fetch(`${API_URL}/conversation/${userID}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get conversations');
      }
      return await response.json();
    } catch (error) {
      console.error("Error getting conversations");
      throw error;
    }
  },

  getUserDetails: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get user details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting user details:', error);
      throw error;
    }
  },

  getUnreadCount: async (userId, otherUserId) => {
    try {
      const response = await fetch(`${API_URL}/messages/unread/${userId}/${otherUserId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get unread count');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  },

  createMessage: async ({ conversationId, senderID, receiverID, content, type = 'text', payload = null }) => {
    try {
      console.log('Attempting to create a new message', { conversationId, senderID, receiverID, content, type, payload });
      
      if (!conversationId) throw new Error('conversationId is required');
      if (!senderID) throw new Error('senderID is required');
      if (!receiverID) throw new Error('receiverID is required');
      if (!content && !payload) throw new Error('Either content or payload is required');

      const messageData = {
        conversationId,
        senderID,
        receiverID,
        content,
        type,
        payload
      };

      const response = await fetch(`${API_URL}/conversation/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create message');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  readMessage: async (messageID) => {
    try {
      console.log('Attempting to update message to read', messageID);

      const response = await fetch(`${API_URL}/conversation/message/${messageID}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageID)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update message to read');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating message to read:', error);
      throw error;
    }
  },

  getAllMessages: async (conversationId) => {
    try {
      await fetch(`${API_URL}/conversation/messages/${conversationId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get messages');
      }
      return await response.json();
    } catch (error) {
      console.error("Error getting messages");
      throw error;
    }
  }
};
