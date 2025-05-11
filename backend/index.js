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

// User sync endpoint (simplified)
app.post('/api/users/sync', (req, res) => {
  try {
    console.log('Received sync request with data:', req.body);
    const { uid, email, displayName, photoURL } = req.body;
    
    // Just return the data sent in the request for testing
    res.status(200).json({
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

// Simple messages endpoint
app.get('/api/messages/user/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`Getting messages for user: ${userId}`);
  // Return empty array for testing
  res.json([]);
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