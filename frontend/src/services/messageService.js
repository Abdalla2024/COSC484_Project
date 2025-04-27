import { getDB } from '../config/mongodb.js';

export const createMessage = async (senderId, receiverId, content) => {
  try {
    const db = getDB();
    const message = {
      sender: senderId,
      receiver: receiverId,
      content,
      read: false,
      timestamp: new Date()
    };
    const result = await db.collection('messages').insertOne(message);
    return { ...message, _id: result.insertedId };
  } catch (error) {
    throw new Error('Failed to create message: ' + error.message);
  }
};

export const getMessages = async (userId, otherUserId) => {
  try {
    const db = getDB();
    const messages = await db.collection('messages')
      .find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId }
        ]
      })
      .sort({ timestamp: 1 })
      .toArray();
    return messages;
  } catch (error) {
    throw new Error('Failed to get messages: ' + error.message);
  }
};

export const markMessagesAsRead = async (userId, otherUserId) => {
  try {
    const db = getDB();
    await db.collection('messages').updateMany(
      { receiver: userId, sender: otherUserId, read: false },
      { $set: { read: true } }
    );
  } catch (error) {
    throw new Error('Failed to mark messages as read: ' + error.message);
  }
};

export const getUnreadMessageCount = async (userId) => {
  try {
    const db = getDB();
    const count = await db.collection('messages').countDocuments({
      receiver: userId,
      read: false
    });
    return count;
  } catch (error) {
    throw new Error('Failed to get unread message count: ' + error.message);
  }
}; 