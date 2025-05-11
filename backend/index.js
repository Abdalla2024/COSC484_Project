require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectToDatabase } = require('./config/mongodb');
const Listing = require('./models/listing');
const Message = require('./models/message');
const User    = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure MongoDB is connected before any route
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

// Health-check
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// ── LISTING ENDPOINTS ───────────────────────────────────────────────────────────
// GET all listings
app.get('/api/listing', async (req, res, next) => {
  try {
    const allListings = await Listing.find().lean();
    res.json(allListings);
  } catch (err) {
    next(err);
  }
});

// GET one listing by ID
app.get('/api/listing/:id', async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).lean();
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    next(err);
  }
});

// ── USER ENDPOINTS ──────────────────────────────────────────────────────────────
// Sync (upsert) user on sign-in (returns full Mongo record including _id)
app.post('/api/users/sync', async (req, res, next) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    const filter = { firebaseId: uid };
    const update = {
      firebaseId: uid,
      email,
      displayName,
      photoURL: photoURL || '',
      username: email.split('@')[0]
    };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
    const user = await User.findOneAndUpdate(filter, update, opts).lean();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Fetch a user by Mongo _id
app.get('/api/users/:userId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// ── MESSAGING ENDPOINTS ────────────────────────────────────────────────────────
// Send a new message
app.post('/api/messages', async (req, res, next) => {
  try {
    const { senderId, receiverId, content } = req.body;
    console.log('Creating message with:', { 
      senderId, 
      receiverId, 
      content,
      senderId_type: typeof senderId,
      receiverId_type: typeof receiverId
    });
    
    // Validate and convert IDs to ObjectIDs if needed
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      console.log('Invalid sender ID format:', senderId);
      return res.status(400).json({ error: 'Invalid senderId' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      console.log('Invalid receiver ID format:', receiverId);
      return res.status(400).json({ error: 'Invalid receiverId' });
    }
    
    // Always create with proper ObjectId
    const messageData = {
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      content,
      read: false,
      timestamp: new Date()
    };
    
    const msg = await Message.create(messageData);
    console.log('Created message:', msg);
    
    // Convert ObjectIDs to strings for the frontend
    const processedMsg = {
      ...msg.toObject(),
      _id: msg._id.toString(),
      senderId: msg.senderId.toString(),
      receiverId: msg.receiverId.toString()
    };
    
    res.status(201).json(processedMsg);
  } catch (err) {
    console.error('Error creating message:', err);
    next(err);
  }
});

// ── Get all messages involving this Mongo userId ──
app.get('/api/messages/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching messages for user ID:', userId);
    console.log('User ID type:', typeof userId);
    
    // validate userId is a real ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid ObjectId format:', userId);
      return res.status(400).json({ error: 'Invalid userId' });
    }
    
    const oid = new mongoose.Types.ObjectId(userId);
    console.log('Converted to ObjectId:', oid);

    const convos = await Message.find({
      $or: [
        { senderId: oid },
        { receiverId: oid }
      ]
    })
    .sort({ timestamp: -1 })
    .lean();

    console.log(`Found ${convos.length} messages for user ID: ${userId}`);
    
    if (convos.length > 0) {
      const sample = convos[0];
      console.log('Sample message:', {
        _id: sample._id,
        senderId: sample.senderId,
        senderId_type: typeof sample.senderId,
        receiverId: sample.receiverId,
        receiverId_type: typeof sample.receiverId,
        content: sample.content.substring(0, 30) + '...',
      });
    }

    // Convert ObjectIDs to strings for the frontend
    const processedConvos = convos.map(msg => ({
      ...msg,
      _id: msg._id.toString(),
      senderId: msg.senderId.toString(),
      receiverId: msg.receiverId.toString()
    }));

    return res.json(processedConvos);
  } catch (err) {
    console.error('Error fetching messages for user:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ── Get one‐to‐one thread between two ObjectIds ──
app.get('/api/messages/:userId/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    console.log(`Fetching messages between ${userId} and ${otherUserId}`);
    
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(otherUserId)
    ) {
      console.log('Invalid ObjectId format: userId =', userId, 'otherUserId =', otherUserId);
      return res.status(400).json({ error: 'Invalid userId or otherUserId' });
    }
    
    const uid = new mongoose.Types.ObjectId(userId);
    const oid = new mongoose.Types.ObjectId(otherUserId);
    console.log('Converted to ObjectIds:', { uid, oid });

    const thread = await Message.find({
      $or: [
        { senderId: uid, receiverId: oid },
        { senderId: oid, receiverId: uid }
      ]
    })
    .sort({ timestamp: 1 })
    .lean();

    console.log(`Found ${thread.length} messages between ${userId} and ${otherUserId}`);
    
    if (thread.length > 0) {
      const sample = thread[0];
      console.log('Sample message:', {
        _id: sample._id,
        senderId: sample.senderId,
        receiverId: sample.receiverId,
        content: sample.content.substring(0, 30) + '...',
      });
    }

    // Convert ObjectIDs to strings for the frontend
    const processedThread = thread.map(msg => ({
      ...msg,
      _id: msg._id.toString(),
      senderId: msg.senderId.toString(),
      receiverId: msg.receiverId.toString()
    }));

    return res.json(processedThread);
  } catch (err) {
    console.error('Error fetching thread:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Mark messages read in a thread
app.put('/api/messages/read/:userId/:otherUserId', async (req, res, next) => {
  try {
    const { userId, otherUserId } = req.params;
    console.log(`Marking messages as read between ${userId} and ${otherUserId}`);
    
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(otherUserId)
    ) {
      console.log('Invalid ObjectId format: userId =', userId, 'otherUserId =', otherUserId);
      return res.status(400).json({ error: 'Invalid userId or otherUserId' });
    }
    
    const uid = new mongoose.Types.ObjectId(userId);
    const oid = new mongoose.Types.ObjectId(otherUserId);
    console.log('Converted to ObjectIds:', { uid, oid });
    
    const result = await Message.updateMany(
      { senderId: oid, receiverId: uid, read: false },
      { read: true }
    );
    
    console.log(`Marked ${result.modifiedCount} messages as read`);
    res.json({ success: true, messagesMarkedAsRead: result.modifiedCount });
  } catch (err) {
    console.error('Error marking messages as read:', err);
    next(err);
  }
});

// Get unread count for a thread
app.get('/api/messages/unread/:userId/:otherUserId', async (req, res, next) => {
  try {
    const { userId, otherUserId } = req.params;
    console.log(`Getting unread count between ${userId} and ${otherUserId}`);
    
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(otherUserId)
    ) {
      console.log('Invalid ObjectId format: userId =', userId, 'otherUserId =', otherUserId);
      return res.status(400).json({ error: 'Invalid userId or otherUserId' });
    }
    
    const uid = new mongoose.Types.ObjectId(userId);
    const oid = new mongoose.Types.ObjectId(otherUserId);
    console.log('Converted to ObjectIds:', { uid, oid });
    
    const count = await Message.countDocuments({
      senderId: oid,
      receiverId: uid,
      read: false
    });
    
    console.log(`Found ${count} unread messages`);
    res.json({ count });
  } catch (err) {
    console.error('Error getting unread count:', err);
    next(err);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start local dev server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;