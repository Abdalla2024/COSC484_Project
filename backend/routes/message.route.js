const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const User = require('../models/user');

// Get all messages for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching messages for user ID:', userId);
        console.log('User ID type:', typeof userId);
        
        // Get the user to verify it exists
        const user = await User.findById(userId);
        if (!user) {
            console.log(`No user found with ID: ${userId}`);
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(`Found user: ${user.displayName}`);
        
        // Try with ObjectId
        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ timestamp: -1 });
        
        console.log(`Found ${messages.length} messages for user ID: ${userId}`);
        if (messages.length > 0) {
            console.log('First message sample:', {
                _id: messages[0]._id,
                senderId: messages[0].senderId,
                receiverId: messages[0].receiverId,
                content: messages[0].content.substring(0, 30) + '...',
                senderId_type: typeof messages[0].senderId,
                receiverId_type: typeof messages[0].receiverId
            });
        }
        
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
        console.log(`Fetching messages between ${userId} and ${otherUserId}`);
        
        // Check that both users exist
        const [user1, user2] = await Promise.all([
            User.findById(userId),
            User.findById(otherUserId)
        ]);
        
        if (!user1) {
            console.log(`User ${userId} not found`);
            return res.status(404).json({ error: `User ${userId} not found` });
        }
        
        if (!user2) {
            console.log(`User ${otherUserId} not found`);
            return res.status(404).json({ error: `User ${otherUserId} not found` });
        }
        
        console.log(`Found users: ${user1.displayName} and ${user2.displayName}`);
        
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ timestamp: 1 });
        
        console.log(`Found ${messages.length} messages between ${userId} and ${otherUserId}`);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages between users:', error);
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