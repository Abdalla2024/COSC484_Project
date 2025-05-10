const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation');

//Create a new conversation
router.post('/', async (req, res) => {
    try {
      const { users } = req.body;
  
      if (!Array.isArray(users) || users.length !== 2) {
        return res.status(400).json({ error: "Exactly two users are required" });
      }
  
      if (users[0] === users[1]) {
        return res.status(400).json({ error: "Cannot start a conversation with yourself" });
      }
  
      const existing = await Conversation.findOne({ users: { $all: users } });
      if (existing) {
        return res.status(200).json(existing); 
      }
  
      const conversation = await Conversation.create({ users });
      res.status(201).json(conversation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Get all conversations
  router.get('/:userId', async (req, res) => {
    try {
      const conversations = await Conversation.find({ users: req.params.userId })
        .populate('users', 'username fullName profilePicture')
        .populate('lastMessage.senderID', 'username')
        .sort({ updatedAt: -1 }); // Sort by last activity (optional)
      
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  //Create a new message
  router.post('/message', async (req, res) => {
    try {
      const { conversationId, senderID, receiverID, content, type, payload } = req.body;
  
      const message = {
        senderID,
        receiverID,
        content,
        type,
        payload,
        read: false,
      };
  
      // Add message to the conversation
      const conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { $push: { messages: message }, lastMessage: { content, senderID, createdAt: new Date() } },
        { new: true }
      ).populate('lastMessage.senderID', 'username');
      
      res.status(201).json(conversation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
 // Mark an embedded message as read
router.patch('/message/:messageId/read', async (req, res) => {
    try {
      const { messageId } = req.params;
  
      // Find the conversation that has this message
      const conversation = await Conversation.findOne({ "messages._id": messageId });
  
      if (!conversation) {
        return res.status(404).json({ error: "Conversation or message not found" });
      }
  
      const message = conversation.messages.id(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      message.read = true;
      await conversation.save();
  
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Get all messages for a conversation
router.get('/messages/:conversationId', async (req, res) => {
    try {
      const conversation = await Conversation.findById(req.params.conversationId)
        .select('messages') 
        .populate('messages.senderID', 'username') 
        .populate('messages.receiverID', 'username'); 
  
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
  
      res.status(200).json(conversation.messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  module.exports = router;