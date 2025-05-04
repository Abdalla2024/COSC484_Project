const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
const Listing = require('./models/listing')
const User = require('./models/user')
const listingRoutes = require('./routes/listing.route')

const app = express()

// Configure CORS with specific options
app.use((req, res, next) => {
    console.log('Request origin:', req.headers.origin); // Log the origin
    cors({
        origin: function(origin, callback) {
            console.log('Checking origin:', origin); // Log the origin being checked
            callback(null, true); // Temporarily allow all origins
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })(req, res, next);
});

// Add middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

// Use the listing routes
app.use('/api/listing', listingRoutes)

// Root route
app.get('/', (req, res) => {
    res.send('Hello World')
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err)
    })