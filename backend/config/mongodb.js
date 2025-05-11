const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cosc484project';

// Cache the database connection to reuse it across serverless function invocations
let cachedDb = null;

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

async function connectToDatabase() {
  console.log('Starting MongoDB connection...');
  
  // If we already have a connection, use it
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return { db: mongoose.connection.db, mongoose: mongoose };
  }

  try {
    // Connect to the MongoDB database
    console.log('Connecting to MongoDB:', MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@'));
    
    // Create new connection
    const conn = await mongoose.connect(MONGODB_URI, options);
    cachedDb = conn;
    
    console.log('Connected to MongoDB successfully');
    
    // Event handlers for the connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cachedDb = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedDb = null;
    });
    
    return { db: mongoose.connection.db, mongoose: mongoose };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connectToDatabase }; 