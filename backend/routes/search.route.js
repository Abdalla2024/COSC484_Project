const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const Listing = require('../models/listing');
const User = require('../models/user');

// Search Messages Route
router.get('/messages', async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    // First, find messages matching the content
    const messages = await Message.find({
      content: { $regex: searchTerm, $options: "i" }
    })
    .sort({ timestamp: -1 })
    .select('_id senderId receiverId content timestamp read')
    .lean();

    // Get unique user IDs from the messages
    const userIds = [...new Set(messages.flatMap(msg => [msg.senderId, msg.receiverId]))];

    // Find all users involved in these messages
    const users = await User.find({
      firebaseId: { $in: userIds }
    }).select('_id firebaseId displayName photoURL').lean();

    // Create a map of user IDs to user data
    const userMap = users.reduce((map, user) => {
      map[user.firebaseId] = user;
      return map;
    }, {});

    // Also search for users by display name
    const usersByName = await User.find({
      displayName: { $regex: searchTerm, $options: "i" }
    }).select('_id firebaseId displayName photoURL').lean();

    // Get messages for users found by name
    const messagesByUser = await Message.find({
      $or: [
        { senderId: { $in: usersByName.map(u => u.firebaseId) } },
        { receiverId: { $in: usersByName.map(u => u.firebaseId) } }
      ]
    })
    .sort({ timestamp: -1 })
    .select('_id senderId receiverId content timestamp read')
    .lean();

    // Combine and deduplicate messages
    const allMessages = [...messages, ...messagesByUser];
    const uniqueMessages = Array.from(new Map(allMessages.map(msg => [msg._id.toString(), msg])).values());

    // Add user data to messages
    const messagesWithUsers = uniqueMessages.map(msg => ({
      ...msg,
      sender: userMap[msg.senderId] || null,
      receiver: userMap[msg.receiverId] || null
    }));

    res.json(messagesWithUsers);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: error.message });
  }
});

// Search Listings Route
router.get('/listings', async (req, res) => {
  const searchTerm = req.query.q || "";
  const category = req.query.category;
  
  try {
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (searchTerm.trim()) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } }
      ];
    }
    
    const listings = await Listing.find(query).lean();
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
