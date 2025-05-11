require('dotenv').config();
const express = require('express')
const cors = require('cors')
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
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

// Add error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

// Add middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS configuration
const corsOptions = {
  origin: 'https://cosc-484-project-front-git-7cbc3b-abdalla-abdelmagids-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle OPTIONS requests explicitly
app.options('*', cors(corsOptions));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB before handling any requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Use the routes
app.use('/api/listing', listingRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Hello World! API is running.' });
});

// Test route for environment variables
app.get('/api/test-env', (req, res) => {
    res.json({
        nodeEnv: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
        vercelEnv: process.env.VERCEL_ENV,
        allEnvKeys: Object.keys(process.env)
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel
module.exports = app;