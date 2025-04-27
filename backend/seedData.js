import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'cosc484project';

const dummyUsers = [
  {
    firebaseId: 'sdWvbHEm7WVBrQ1uiibMznkK46T2',
    email: 'aabdel9@students.towson.edu',
    displayName: 'Abdalla Abdelmagid',
    photoURL: 'https://i.pravatar.cc/150?img=4',
    createdAt: new Date()
  },
  {
    firebaseId: 'user2',
    email: 'jane@example.com',
    displayName: 'Jane Smith',
    photoURL: 'https://i.pravatar.cc/150?img=2',
    createdAt: new Date()
  },
  {
    firebaseId: 'user3',
    email: 'bob@example.com',
    displayName: 'Bob Johnson',
    photoURL: 'https://i.pravatar.cc/150?img=3',
    createdAt: new Date()
  }
];

const dummyMessages = [
  {
    senderId: 'sdWvbHEm7WVBrQ1uiibMznkK46T2',
    receiverId: 'user2',
    content: 'Hey Jane, how\'s the project going?',
    read: false,
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    senderId: 'user2',
    receiverId: 'sdWvbHEm7WVBrQ1uiibMznkK46T2',
    content: 'Hi Abdalla! It\'s going well. I just finished the authentication part.',
    read: false,
    timestamp: new Date(Date.now() - 3500000) // 58 minutes ago
  },
  {
    senderId: 'sdWvbHEm7WVBrQ1uiibMznkK46T2',
    receiverId: 'user2',
    content: 'Great! I\'m working on the messaging feature now.',
    read: false,
    timestamp: new Date(Date.now() - 3400000) // 56 minutes ago
  },
  {
    senderId: 'user2',
    receiverId: 'sdWvbHEm7WVBrQ1uiibMznkK46T2',
    content: 'Awesome! Let me know if you need any help with that.',
    read: false,
    timestamp: new Date(Date.now() - 3300000) // 55 minutes ago
  },
  {
    senderId: 'user3',
    receiverId: 'sdWvbHEm7WVBrQ1uiibMznkK46T2',
    content: 'Hey Abdalla, can you review my pull request?',
    read: false,
    timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
  },
  {
    senderId: 'sdWvbHEm7WVBrQ1uiibMznkK46T2',
    receiverId: 'user3',
    content: 'Sure Bob, I\'ll take a look at it now.',
    read: false,
    timestamp: new Date(Date.now() - 1700000) // 28 minutes ago
  },
  {
    senderId: 'sdWvbHEm7WVBrQ1uiibMznkK46T2',
    receiverId: 'user3',
    content: 'The changes look good! I\'ve approved it.',
    read: false,
    timestamp: new Date(Date.now() - 900000) // 15 minutes ago
  },
  {
    senderId: 'user3',
    receiverId: 'sdWvbHEm7WVBrQ1uiibMznkK46T2',
    content: 'Thanks for the quick review!',
    read: false,
    timestamp: new Date(Date.now() - 800000) // 13 minutes ago
  }
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('messages').deleteMany({});

    // Insert dummy users
    await db.collection('users').insertMany(dummyUsers);
    console.log('Dummy users inserted');

    // Insert dummy messages
    await db.collection('messages').insertMany(dummyMessages);
    console.log('Dummy messages inserted');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase(); 