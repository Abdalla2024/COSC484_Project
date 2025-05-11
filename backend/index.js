// Serverless Express app with MongoDB connection
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/mongodb');
const app = express();

// Configure CORS
const allowedOrigins = [
  'https://cosc-484-project-front.vercel.app',
  'https://cosc-484-project-front-git-7cbc3b-abdalla-abdelmagids-projects.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    console.log('Request origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin not allowed by CORS:', origin);
      callback(null, true); // Allow all origins for now while debugging
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400
}));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Listings endpoint - fetch real data from MongoDB
app.get('/api/listing', async (req, res) => {
  console.log('Fetching all listings from MongoDB');
  try {
    // Connect to the database
    const { db, mongoose } = await connectToDatabase();
    
    // Get the Listing model (if not already imported)
    const Listing = mongoose.models.Listing || 
      mongoose.model('Listing', new mongoose.Schema({}, { strict: false }), 'listings');
    
    // Fetch all listings
    const listings = await Listing.find().limit(20);
    console.log(`Found ${listings.length} listings`);
    
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    // Return mock data as fallback if MongoDB connection fails
    const sampleListings = [
      {
        _id: "680fdb8fdc23fee2330354e2",
        sellerId: "607d1f77bcf86cd799439011",
        title: "Test Book",
        description: "A brand-new test book.",
        price: 19.99,
        category: "Textbooks",
        condition: "like new",
        images: [],
        deliveryMethod: "Both",
        meetupLocation: "Campus Quad",
        status: "active",
        highestBid: 0,
        bids: [],
        createdAt: "2025-04-28T19:48:31.681+00:00",
        updatedAt: "2025-04-28T19:48:31.681+00:00"
      },
      {
        _id: "6812e800dd41b1024c343259",
        sellerId: "65f3b1234567890123456789",
        title: "z d ",
        description: "csdv",
        price: 418,
        category: "Clothing",
        condition: "poor",
        images: [],
        deliveryMethod: "Shipping",
        status: "active",
        highestBid: 0,
        bids: [],
        createdAt: "2025-05-01T03:18:24.873+00:00",
        updatedAt: "2025-05-01T03:18:24.873+00:00"
      },
      {
        _id: "6813e8b5a89fd1e748f61e20",
        sellerId: "65f3b1234567890123456789",
        title: "ps5 controller",
        description: "never used still have the box",
        price: 81,
        category: "Electronics",
        condition: "new",
        images: [],
        deliveryMethod: "Shipping",
        status: "active",
        highestBid: 0,
        bids: [],
        createdAt: "2025-05-01T21:33:41.097+00:00",
        updatedAt: "2025-05-01T21:33:41.097+00:00"
      },
      {
        _id: "6817b6f417b2d4103c25b832",
        sellerId: "65f3b1234567890123456789",
        title: "Crayons",
        description: "Just a box of 24 crayons",
        price: 10,
        category: "Art Supplies",
        condition: "new",
        images: [],
        deliveryMethod: "Meetup",
        meetupLocation: "Union",
        status: "active",
        highestBid: 0,
        bids: [],
        createdAt: "2025-05-04T18:50:28.689+00:00",
        updatedAt: "2025-05-04T18:50:28.689+00:00"
      },
      {
        _id: "6813e57ea89fd1e748f61e1a",
        sellerId: "65f3b1234567890123456789",
        title: "algebra 1 textbook",
        description: "just like new",
        price: 72,
        category: "Textbooks",
        condition: "fair",
        images: [],
        deliveryMethod: "Shipping",
        status: "active",
        highestBid: 0,
        bids: [],
        createdAt: "2025-05-01T21:19:58.313+00:00",
        updatedAt: "2025-05-01T21:19:58.313+00:00"
      }
    ];
    
    res.json(sampleListings);
  }
});

app.get('/api/listing/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching listing with id: ${id}`);
  
  try {
    // Connect to the database
    const { db, mongoose } = await connectToDatabase();
    
    // Get the Listing model
    const Listing = mongoose.models.Listing || 
      mongoose.model('Listing', new mongoose.Schema({}, { strict: false }), 'listings');
    
    // Find the listing by ID
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// User sync endpoint
app.post('/api/users/sync', async (req, res) => {
  try {
    console.log('Received sync request with data:', req.body);
    const { uid, email, displayName, photoURL } = req.body;
    
    // Connect to the database
    const { db, mongoose } = await connectToDatabase();
    
    // Get the User model
    const User = mongoose.models.User || 
      mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
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
    } else {
      // Update existing user
      user.firebaseId = uid;
      user.displayName = displayName;
      user.photoURL = photoURL || '';
      await user.save();
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add minimal routes for the rest of the endpoints
// (We can expand these as needed)

app.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Connect to the database
    const { db, mongoose } = await connectToDatabase();
    
    // Get the User model
    const User = mongoose.models.User || 
      mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    
    // Find user by ID or Firebase ID
    const user = await User.findOne({
      $or: [
        { _id: userId },
        { firebaseId: userId }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Messages endpoints
app.post('/api/messages', (req, res) => {
  try {
    console.log('Creating message with data:', req.body);
    const { senderId, receiverId, content } = req.body;
    
    const message = {
      _id: Math.random().toString(36).substring(7),
      senderId,
      receiverId,
      content,
      read: false,
      timestamp: new Date()
    };
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages/user/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`Getting messages for user: ${userId}`);
  res.json([]);
});

app.get('/api/messages/:userId/:otherUserId', (req, res) => {
  const { userId, otherUserId } = req.params;
  console.log(`Getting conversation between ${userId} and ${otherUserId}`);
  res.json([]);
});

app.put('/api/messages/read/:userId/:otherUserId', (req, res) => {
  const { userId, otherUserId } = req.params;
  console.log(`Marking messages as read for ${userId} from ${otherUserId}`);
  res.json({ success: true });
});

app.get('/api/messages/unread/:userId/:otherUserId', (req, res) => {
  const { userId, otherUserId } = req.params;
  console.log(`Getting unread count between ${userId} and ${otherUserId}`);
  res.json({ count: 0 });
});

app.get('/api/messages/unread/count/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`Getting total unread count for user: ${userId}`);
  res.json({ count: 0 });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for serverless
module.exports = app;