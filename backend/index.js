// Ultra simplified Express app for Vercel
const express = require('express');
const cors = require('cors');
const app = express();

// Handle CORS directly with middleware
app.use(cors());

// Basic middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
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