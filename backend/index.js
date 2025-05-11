require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/mongodb');
const Listing = require('./models/listing');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB once at startup
connectToDatabase()
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// Root health-check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

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
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    next(error);
  }
});

// POST a message (mock)
app.post('/api/messages', (req, res) => {
  const message = {
    _id: Math.random().toString(36).substring(7),
    ...req.body,
    read: false,
    timestamp: new Date().toISOString(),
  };
  res.status(201).json(message);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

// Export app for serverless deployment
module.exports = app;
