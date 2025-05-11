// Simplified Express app for serverless environment
const express = require('express');
const cors = require('cors');

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

// Listings endpoint
app.get('/api/listing', (req, res) => {
  console.log('Fetching all listings');
  res.json([]);
});

app.get('/api/listing/:id', (req, res) => {
  console.log(`Fetching listing with id: ${req.params.id}`);
  res.json({
    _id: req.params.id,
    title: 'Sample Listing',
    description: 'This is a sample listing',
    price: 100,
    condition: 'New',
    category: 'Other',
    seller: 'user123',
    createdAt: new Date()
  });
});

// User endpoints
app.post('/api/users/sync', (req, res) => {
  try {
    console.log('Received sync request with data:', req.body);
    const { uid, email, displayName, photoURL } = req.body;
    
    res.status(200).json({
      _id: '123456789',
      firebaseId: uid,
      email,
      displayName,
      photoURL: photoURL || '',
      username: email ? email.split('@')[0] : 'user',
    });
  } catch (error) {
    console.error('Error handling sync request:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', (req, res) => {
  console.log('Fetching all users');
  res.json([]);
});

app.get('/api/users/:userId', (req, res) => {
  console.log(`Fetching user with id: ${req.params.userId}`);
  res.json({
    _id: req.params.userId,
    firebaseId: req.params.userId,
    displayName: 'Sample User',
    email: 'user@example.com',
    photoURL: '',
  });
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