const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cosc484project';
console.log('MongoDB URI:', MONGODB_URI);

// Create a connection pool
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5
};

// Create a connection pool
let pool = null;

const getConnection = async () => {
  try {
    if (!pool) {
      console.log('Creating new connection pool...');
      pool = await mongoose.createConnection(MONGODB_URI, options);
      
      pool.on('connected', () => {
        console.log('Mongoose connected to MongoDB');
      });
      
      pool.on('error', (err) => {
        console.error('Mongoose connection error:', err);
        pool = null;
      });
      
      pool.on('disconnected', () => {
        console.log('Mongoose disconnected from MongoDB');
        pool = null;
      });
    }
    return pool;
  } catch (error) {
    console.error('Error creating connection pool:', error);
    pool = null;
    throw error;
  }
};

const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

module.exports = {
  getConnection,
  closeConnection
}; 