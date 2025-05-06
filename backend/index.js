<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/mongodb');
const Listing = require('./models/listing');
const Message = require('./models/message');
const User    = require('./models/user');
=======
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
const Listing = require('./models/listing')
const User = require('./models/user')
const listingRoutes = require('./routes/listing.route')
const checkoutRoutes = require('./routes/checkout.route');

>>>>>>> ddb55d6 (Starting stripe implementation in backend)

const app = express();

// Enable CORS for all routes
app.use(cors());
// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure MongoDB connection before handling any request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

// Root health-check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// ── Listing Endpoints 
// GET all listings
app.get('/api/listing', async (req, res, next) => {
  try {
    const allListings = await Listing.find().lean();
    res.json(allListings);
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
// GET one listing by ID
app.get('/api/listing/:id', async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).lean();
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    next(error);
  }
});
=======
// checkout route
app.use('/api/checkout', checkoutRoutes);


// Root route
app.get('/', (req, res) => {
    res.send('Hello World')
})
>>>>>>> ddb55d6 (Starting stripe implementation in backend)

// ── User Endpoints 
// Sync (upsert) user on sign-in
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
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const user = await User.findOneAndUpdate(filter, update, options).lean();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Get user by Firebase UID
app.get('/api/users/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ firebaseId: userId }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ── Messaging Endpoints
// Send a new message
app.post('/api/messages', async (req, res, next) => {
  try {
    const msg = await Message.create(req.body);
    res.status(201).json(msg);
  } catch (error) {
    next(error);
  }
});

// Get all conversations for a user
app.get('/api/messages/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const convos = await Message.find({
      $or: [ { senderId: userId }, { receiverId: userId } ]
    }).sort('timestamp').lean();
    res.json(convos);
  } catch (error) {
    next(error);
  }
});

// Get one-to-one thread between two users
app.get('/api/messages/:userId/:otherUserId', async (req, res, next) => {
  try {
    const { userId, otherUserId } = req.params;
    const thread = await Message.find({
      $or: [
        { senderId: userId,   receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort('timestamp').lean();
    res.json(thread);
  } catch (error) {
    next(error);
  }
});

// Mark messages as read
app.put('/api/messages/read/:userId/:otherUserId', async (req, res, next) => {
  try {
    const { userId, otherUserId } = req.params;
    await Message.updateMany(
      { senderId: otherUserId, receiverId: userId, read: false },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Get unread message count
app.get('/api/messages/unread/:userId/:otherUserId', async (req, res, next) => {
  try {
    const { userId, otherUserId } = req.params;
    const count = await Message.countDocuments({
      senderId: otherUserId,
      receiverId: userId,
      read: false
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export app for serverless deployment
module.exports = app;
