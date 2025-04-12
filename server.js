import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDB, closeDB } from './src/config/mongodb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.get('/api/messages/:userId/:otherUserId', async (req, res) => {
  try {
    const db = getDB();
    const messages = await db.collection('messages')
      .find({
        $or: [
          { sender: req.params.userId, receiver: req.params.otherUserId },
          { sender: req.params.otherUserId, receiver: req.params.userId }
        ]
      })
      .sort({ timestamp: 1 })
      .toArray();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    const db = getDB();
    const message = {
      sender,
      receiver,
      content,
      read: false,
      timestamp: new Date()
    };
    const result = await db.collection('messages').insertOne(message);
    res.status(201).json({ ...message, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/messages/read/:userId/:otherUserId', async (req, res) => {
  try {
    const db = getDB();
    await db.collection('messages').updateMany(
      { receiver: req.params.userId, sender: req.params.otherUserId, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 