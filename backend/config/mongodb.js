const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cosc484project';
console.log('MongoDB URI:', MONGODB_URI);

let cachedConnection = null;

const connectDB = async () => {
  try {
    // If we have a cached connection, return it
    if (cachedConnection) {
      console.log('Using cached MongoDB connection');
      return cachedConnection;
    }

    console.log('Attempting to connect to MongoDB...');
    const connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log('MongoDB connected successfully');
    
    // Cache the connection
    cachedConnection = connection;
    
    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
      cachedConnection = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
      cachedConnection = null;
    });

    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cachedConnection = null;
    throw error;
  }
};

const closeDB = async () => {
  try {
    if (cachedConnection) {
      await mongoose.connection.close();
      cachedConnection = null;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

module.exports = {
  connectDB,
  closeDB
}; 