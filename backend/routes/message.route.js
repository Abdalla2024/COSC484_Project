const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const User = require('../models/user');

// Get all messages for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching messages for user:', userId);
        
        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ timestamp: -1 });
        
        console.log('Found messages:', messages);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all messages between two users
router.get('/:userId/:otherUserId', async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new message
router.post('/', async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;
        console.log('Creating new message:', { senderId, receiverId, content });
        
        const message = await Message.create({
            senderId,
            receiverId,
            content,
            read: false, // Explicitly set read status to false
            timestamp: new Date()
        });
        
        console.log('Created message:', message);
        res.status(201).json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mark messages as read
router.put('/read/:userId/:otherUserId', async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;
        await Message.updateMany(
            {
                senderId: otherUserId,
                receiverId: userId,
                read: false
            },
            { read: true }
        );
        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get unread message count
router.get('/unread/:userId/:otherUserId', async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;
        const count = await Message.countDocuments({
            senderId: otherUserId,
            receiverId: userId,
            read: false
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 