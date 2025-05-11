const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

// Get user by ID
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching user with ID:', userId);
        
        let user;
        
        // Check if userId is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(userId)) {
            user = await User.findById(userId);
        }
        
        // If not found or not a valid ObjectId, try to find by Firebase ID
        if (!user) {
            user = await User.findOne({ firebaseId: userId });
        }
        
        if (!user) {
            console.log('User not found for ID:', userId);
            return res.status(404).json({ error: 'User not found' });
        }
        
        console.log('Found user:', user);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 