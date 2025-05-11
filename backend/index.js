require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/mongodb');
const Listing = require('./models/listing');
const Message = require('./models/message');
const User    = require('./models/user');
const Review  = require('./models/review');
const reviewRoutes = require('./routes/review.route');
const mongoose = require('mongoose')

// Import routes
const searchRoutes = require('./routes/search.route');

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

// Mount review routes
app.use('/api/reviews', reviewRoutes);

// Use routes
app.use('/api/search', searchRoutes);

// ── Listing Endpoints 
// GET all listings
app.get('/api/listing', async (req, res, next) => {
  try {
    console.log('Fetching all listings');
    const allListings = await Listing.find().lean();
    
    // Create a map of all unique seller IDs
    const sellerIds = [...new Set(allListings.map(listing => 
      listing.sellerId ? listing.sellerId.toString() : null).filter(Boolean))];
    
    console.log(`Found ${sellerIds.length} unique sellers in listings`);
    
    // Fetch all sellers in a single query
    const sellers = await User.find({ _id: { $in: sellerIds } }).lean();
    
    // Create a map for quick seller lookup
    const sellerMap = {};
    sellers.forEach(seller => {
      sellerMap[seller._id.toString()] = {
        _id: seller._id.toString(),
        username: seller.username || seller.email.split('@')[0],
        displayName: seller.displayName || seller.username,
        profileImage: seller.photoURL
      };
    });
    
    // Add seller info to each listing and convert ObjectIDs to strings
    const processedListings = allListings.map(listing => {
      // Convert ObjectIDs to strings
      listing._id = listing._id.toString();
      if (listing.sellerId) {
        const sellerIdStr = listing.sellerId.toString();
        listing.sellerId = sellerIdStr;
        
        // Add seller data if available
        if (sellerMap[sellerIdStr]) {
          listing.seller = sellerMap[sellerIdStr];
        }
      }
      return listing;
    });
    
    console.log(`Returning ${processedListings.length} listings with seller data`);
    res.json(processedListings);
  } catch (err) {
    console.error('Error fetching all listings:', err);
    next(err);
  }
});

// GET listings by seller ID
app.get('/api/listing/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching listings for seller: ${userId}`);
    
    let sellerId = userId;
    
    // If it's not a valid MongoDB ObjectId, try to find the user's MongoDB ID by Firebase ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Not a valid ObjectId, looking up user by Firebase ID');
      const user = await User.findOne({ firebaseId: userId }).lean();
      
      if (!user) {
        console.log('User not found for Firebase ID:', userId);
        return res.status(404).json({ error: 'User not found' });
      }
      
      sellerId = user._id;
      console.log('Found MongoDB ID:', sellerId, 'for Firebase ID:', userId);
    }
    
    // Find all listings by this seller
    const listings = await Listing.find({ sellerId: new mongoose.Types.ObjectId(sellerId) }).lean();
    console.log(`Found ${listings.length} listings for seller ${userId}`);
    
    // Get seller info
    const seller = await User.findById(sellerId).lean();
    
    // Process listings: convert IDs to strings and add seller info
    const processedListings = listings.map(listing => {
      // Convert ObjectIDs to strings
      listing._id = listing._id.toString();
      listing.sellerId = listing.sellerId.toString();
      
      // Add seller data if available
      if (seller) {
        listing.seller = {
          _id: seller._id.toString(),
          username: seller.username || seller.email.split('@')[0],
          displayName: seller.displayName || seller.username,
          profileImage: seller.photoURL
        };
      }
      
      return listing;
    });
    
    res.json(processedListings);
  } catch (err) {
    console.error('Error fetching seller listings:', err);
    next(err);
  }
});

// GET one listing by ID
app.get('/api/listing/:id', async (req, res, next) => {
  try {
    console.log('Fetching listing with ID:', req.params.id);
    const listing = await Listing.findById(req.params.id).lean();
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Convert ObjectIDs to strings for better compatibility with the frontend
    listing._id = listing._id.toString();
    if (listing.sellerId) {
      listing.sellerId = listing.sellerId.toString();
    }
    
    // If we have a seller ID, fetch the seller information
    if (listing.sellerId) {
      console.log('Fetching seller with ID:', listing.sellerId);
      try {
        const seller = await User.findById(listing.sellerId).lean();
        if (seller) {
          // Add seller information to the listing response
          listing.seller = {
            _id: seller._id.toString(),
            username: seller.username || seller.email.split('@')[0],
            displayName: seller.displayName || seller.username,
            email: seller.email,
            photoURL: seller.photoURL,
            profileImage: seller.photoURL
          };
          console.log('Found seller:', listing.seller.displayName);
        } else {
          console.log('Seller not found with ID:', listing.sellerId);
          listing.seller = { _id: listing.sellerId };
        }
      } catch (sellerErr) {
        console.error('Error fetching seller:', sellerErr);
        // Don't fail the whole request if seller fetch fails
        listing.seller = { _id: listing.sellerId };
      }
    } else {
      console.log('No seller ID found for listing');
    }
    
    console.log('Sending listing with seller data:', !!listing.seller);
    res.json(listing);
  } catch (err) {
    console.error('Error fetching listing:', err);
    next(err);
  }
});

// CREATE a new listing
app.post('/api/listing', async (req, res, next) => {
  try {
    console.log('Creating new listing with data:', req.body);
    
    // Validate sellerId is a valid ObjectId
    if (req.body.sellerId && !mongoose.Types.ObjectId.isValid(req.body.sellerId)) {
      console.log('Invalid sellerId format:', req.body.sellerId);
      return res.status(400).json({ error: 'Invalid sellerId format' });
    }
    
    // Create the listing
    const listing = await Listing.create(req.body);
    console.log('Created listing:', listing);
    
    res.status(201).json(listing);
  } catch (err) {
    console.error('Error creating listing:', err);
    next(err);
  }
});

//Update a listing
app.patch('/api/listing/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, req.body, { new: true });
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
    console.log('Fetching user data for ID:', userId);
    
    let user = null;
    
    // First try to find by MongoDB ObjectId if it's valid
    if (mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Searching for user by MongoDB ObjectId');
      user = await User.findById(userId).lean();
      console.log('Result by ObjectId search:', user ? 'Found' : 'Not found');
    }
    
    // If not found or not a valid ObjectId, try by Firebase ID
    if (!user) {
      console.log('Searching for user by Firebase ID');
      user = await User.findOne({ firebaseId: userId }).lean();
      console.log('Result by Firebase ID search:', user ? 'Found' : 'Not found');
    }
    
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Convert ObjectID to string for the frontend
    user._id = user._id.toString();
    
    console.log('Found user:', user.displayName || user.username || user.email);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    next(err);
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
