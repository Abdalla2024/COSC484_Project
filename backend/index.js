require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/mongodb');
const Listing = require('./models/listing');
const Message = require('./models/message');
const User    = require('./models/user');
const searchRoutes  = require('./routes/search.route')

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


// Root route
app.get('/', (req, res) => {
    res.send('Hello World')
})

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

//--Search Functionality 
app.get('/api/search/messages', async (req, res, next) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const messages = await Message.find({
      content: { $regex: searchTerm, $options: "i" }
    })
    .sort({ timestamp: -1 })
    .select('_id senderId receiverId content timestamp read')
    .lean();

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    // Pass to your error handler
    next(error);
  }
});

app.get('/api/search/listings', async (req, res, next) => {
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
    // Pass to your error handler
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
