const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const { connectDB } = require('../config/mongodb'); // Adjust path as needed

connectDB(); 

// Search Messages Route
router.get('/messages', async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const Message = mongoose.connection.db.collection('messages');
    const messages = await Message.aggregate([
      {
        $match: {
      content: { $regex: searchTerm, $options: "i" }
        }
      },
      { $sort: { timestamp: -1 } },
      {
        $project: {
          _id: 1,
          senderId: 1,
          receiverId: 1,
          content: 1,
          timestamp: 1,
          read: 1
        }
      }
    ]).toArray();

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/listings', async (req, res) => {
  const searchTerm = req.query.q || "";
  const category = req.query.category;
  
  try {
      const db = mongoose.connection.db.collection('listings');
  
    let query = {};
    
      // If a category is provided, include it in the query
    if (category) {
      query.category = category;
    }
    
      // If a search term is provided, apply the $or condition
    if (searchTerm.trim()) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } }
      ];
    }
    
      const listings = await db.find(query).toArray();
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
