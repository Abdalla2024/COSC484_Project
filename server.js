import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'cosc484project';

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// MongoDB connection
let client;
let db;

const connectDB = async () => {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// API Routes
app.get('/api/users', async (req, res) => {
  try {
    console.log('Fetching all users...');
    const users = await db.collection('users').find().toArray();
    console.log('Found users:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to get a single user by firebaseId
app.get('/api/users/:firebaseId', async (req, res) => {
  try {
    console.log('Fetching user with firebaseId:', req.params.firebaseId);
    const user = await db.collection('users').findOne({ firebaseId: req.params.firebaseId });
    console.log('Found user:', user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to get all messages for a user
app.get('/api/messages/user/:userId', async (req, res) => {
  try {
    console.log('Fetching all messages for user:', req.params.userId);
    const messages = await db.collection('messages')
      .find({
        $or: [
          { senderId: req.params.userId },
          { receiverId: req.params.userId }
        ]
      })
      .sort({ timestamp: -1 })
      .toArray();
    console.log('Found messages:', messages);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages/:userId/:otherUserId', async (req, res) => {
  try {
    console.log('Fetching messages between', req.params.userId, 'and', req.params.otherUserId);
    const messages = await db.collection('messages')
      .find({
        $or: [
          { senderId: req.params.userId, receiverId: req.params.otherUserId },
          { senderId: req.params.otherUserId, receiverId: req.params.userId }
        ]
      })
      .sort({ timestamp: 1 })
      .toArray();
    console.log('Found messages:', messages);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    console.log('Creating new message:', req.body);
    const { senderId, receiverId, content } = req.body;
    const message = {
      senderId,
      receiverId,
      content,
      read: false,
      timestamp: new Date()
    };
    const result = await db.collection('messages').insertOne(message);
    console.log('Message created:', { ...message, _id: result.insertedId });
    res.status(201).json({ ...message, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/messages/read/:userId/:otherUserId', async (req, res) => {
  try {
    console.log('Marking messages as read between', req.params.userId, 'and', req.params.otherUserId);
    const result = await db.collection('messages').updateMany(
      { receiverId: req.params.userId, senderId: req.params.otherUserId, read: false },
      { $set: { read: true } }
    );
    console.log('Messages marked as read:', result);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/sync', async (req, res) => {
  try {
    console.log('Received user sync request:', req.body);
    const { uid, email, displayName, photoURL } = req.body;
    
    const user = {
      firebaseId: uid,
      email,
      displayName: displayName || '',
      photoURL: photoURL || '',
      createdAt: new Date()
    };

    console.log('Looking for existing user with firebaseId:', uid);
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ firebaseId: uid });
    console.log('Existing user:', existingUser);
    
    if (!existingUser) {
      console.log('Creating new user');
      await db.collection('users').insertOne(user);
      res.status(201).json(user);
    } else {
      console.log('Returning existing user');
      res.json(existingUser);
    }
  } catch (error) {
    console.error('Error in user sync:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages/unread/:userId/:otherUserId', async (req, res) => {
  try {
    console.log('Counting unread messages between', req.params.userId, 'and', req.params.otherUserId);
    const count = await db.collection('messages')
      .countDocuments({
        receiverId: req.params.userId,
        senderId: req.params.otherUserId,
        read: false
      });
    console.log('Unread count:', count);
    res.json(count);
  } catch (error) {
    console.error('Error counting unread messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
}); 