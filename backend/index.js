require('dotenv').config();
const express = require('express')
const { connectDB } = require('./config/mongodb')
const Listing = require('./models/listing')
const User = require('./models/user')
const listingRoutes = require('./routes/listing.route')
const messageRoutes = require('./routes/message.route')
const userRoutes = require('./routes/user.route')

const app = express()

// Add error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Connect to MongoDB
connectDB().catch(error => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Add middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// User sync endpoint
app.post('/api/users/sync', async (req, res) => {
  try {
    console.log('Received sync request with data:', req.body);
    const { uid, email, displayName, photoURL } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    console.log('Existing user:', user);
    
    if (!user) {
      console.log('Creating new user...');
      // Create new user if doesn't exist
      user = await User.create({
        firebaseId: uid,
        email,
        displayName,
        photoURL: photoURL || '',
        username: email.split('@')[0],
        listings: [],
        reviews: [],
        rating: 0,
        favorites: [],
        messages: []
      });
      console.log('New user created:', user);
    } else {
      console.log('Updating existing user...');
      // Update existing user and ensure all fields exist
      user.firebaseId = uid;
      user.displayName = displayName;
      user.photoURL = photoURL || '';
      user.username = user.username || email.split('@')[0];
      user.listings = user.listings || [];
      user.reviews = user.reviews || [];
      user.rating = user.rating || 0;
      user.favorites = user.favorites || [];
      user.messages = user.messages || [];
      await user.save();
      console.log('User updated:', user);
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/listing', async (req, res) => {
    try {
        const listing = await Listing.create(req.body)
        res.status(201).json(listing)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'COSC484 Project API is running' });
});

// Use the routes
app.use('/api/listing', listingRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
})