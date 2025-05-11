// Ultra simplified Express app for Vercel
const express = require('express');
const cors = require('cors');
const app = express();

// Handle CORS directly with middleware
app.use((req, res, next) => {
  // Allow requests from any origin
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Mock listings endpoint
app.get('/api/listing', (req, res) => {
  console.log('Fetching mock listings');
  
  // Return mock listings
  const mockListings = [
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "6812e800dd41b1024c343259",
      sellerId: "65f3b1234567890123456789",
      title: "PS5 Controller",
      description: "Brand new controller",
      price: 59.99,
      category: "Electronics",
      condition: "new",
      images: [],
      deliveryMethod: "Shipping",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "6813e8b5a89fd1e748f61e20",
      sellerId: "65f3b1234567890123456789",
      title: "Math Textbook",
      description: "Calculus textbook for MATH 201",
      price: 45.00,
      category: "Textbooks",
      condition: "good",
      images: [],
      deliveryMethod: "Meetup",
      meetupLocation: "Library",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  res.json(mockListings);
});

// Mock listing detail endpoint
app.get('/api/listing/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Fetching mock listing with id: ${id}`);
  
  res.json({
    _id: id,
    title: "Sample Listing",
    description: "This is a sample listing",
    price: 29.99,
    category: "Electronics",
    condition: "good",
    sellerId: "user123",
    images: [],
    deliveryMethod: "Both",
    meetupLocation: "Student Center",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

// Mock user sync endpoint
app.post('/api/users/sync', (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;
  console.log(`Mock syncing user: ${displayName} (${email})`);
  
  res.json({
    _id: "user123",
    firebaseId: uid,
    email,
    displayName,
    photoURL: photoURL || '',
    username: email ? email.split('@')[0] : 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

// Mock user detail endpoint
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching mock user with id: ${userId}`);
  
  res.json({
    _id: userId,
    firebaseId: userId,
    displayName: "Mock User",
    email: "mockuser@example.com",
    photoURL: "",
    username: "mockuser"
  });
});

// Mock messages endpoints
app.get('/api/messages/user/:userId', (req, res) => {
  res.json([]);
});

app.get('/api/messages/:userId/:otherUserId', (req, res) => {
  res.json([]);
});

app.put('/api/messages/read/:userId/:otherUserId', (req, res) => {
  res.json({ success: true });
});

app.get('/api/messages/unread/:userId/:otherUserId', (req, res) => {
  res.json({ count: 0 });
});

app.post('/api/messages', (req, res) => {
  const message = {
    _id: Math.random().toString(36).substring(7),
    ...req.body,
    read: false,
    timestamp: new Date().toISOString()
  };
  res.status(201).json(message);
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
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