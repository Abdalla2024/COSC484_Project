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

// Use the routes
app.use('/api/listing', listingRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'COSC484 Project API is running' });
});

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