require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cosc484';
const ABDALLA_MONGO_ID = '680c2e8517afa46b5ace56eb';

async function checkSelfMessages() {
  // Connect to database
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log('Connected successfully');
  
  const db = client.db();
  const messagesCollection = db.collection('messages');
  
  // Find messages where sender and receiver are the same
  console.log('\n--- CHECKING FOR SELF-MESSAGES ---');
  const selfMessages = await messagesCollection.find({
    $expr: { $eq: ["$senderId", "$receiverId"] }
  }).toArray();
  
  console.log(`Found ${selfMessages.length} messages where sender = receiver`);
  
  if (selfMessages.length > 0) {
    console.log('\n--- SAMPLE SELF-MESSAGES ---');
    for (let i = 0; i < Math.min(5, selfMessages.length); i++) {
      const msg = selfMessages[i];
      console.log(`Message ${i+1}:`);
      console.log(`  ID: ${msg._id}`);
      console.log(`  Sender ID: ${msg.senderId}`);
      console.log(`  Receiver ID: ${msg.receiverId}`);
      console.log(`  Content: ${msg.content}`);
      console.log(`  Timestamp: ${msg.timestamp}`);
    }
  }
  
  // Check specifically for Abdalla's self-messages
  const abdallaId = new ObjectId(ABDALLA_MONGO_ID);
  const abdallaOwnMessages = await messagesCollection.find({
    senderId: abdallaId,
    receiverId: abdallaId
  }).toArray();
  
  console.log(`\nFound ${abdallaOwnMessages.length} messages where Abdalla messages himself`);
  
  if (abdallaOwnMessages.length > 0) {
    console.log('\n--- ABDALLA\'S SELF-MESSAGES ---');
    for (let i = 0; i < Math.min(5, abdallaOwnMessages.length); i++) {
      const msg = abdallaOwnMessages[i];
      console.log(`Message ${i+1}:`);
      console.log(`  ID: ${msg._id}`);
      console.log(`  Content: ${msg.content}`);
      console.log(`  Timestamp: ${msg.timestamp}`);
    }
    
    // Let's see if these messages appear in the conversation list
    console.log('\n--- CHECKING IF THESE MESSAGES APPEAR IN CONVERSATION LIST ---');
    const userMessages = await messagesCollection.find({
      $or: [
        { senderId: abdallaId },
        { receiverId: abdallaId }
      ]
    }).toArray();
    
    console.log(`Total messages involving Abdalla: ${userMessages.length}`);
    
    // Get unique conversation partners
    const partners = new Set();
    userMessages.forEach(msg => {
      const senderId = msg.senderId.toString();
      const receiverId = msg.receiverId.toString();
      
      if (senderId === ABDALLA_MONGO_ID && receiverId === ABDALLA_MONGO_ID) {
        partners.add('self');
      } else if (senderId === ABDALLA_MONGO_ID) {
        partners.add(receiverId);
      } else {
        partners.add(senderId);
      }
    });
    
    console.log(`Unique conversation partners: ${partners.size}`);
    console.log('Partners:', Array.from(partners));
  }
  
  // Close connection
  await client.close();
  console.log('\nConnection closed');
}

// Run the check
checkSelfMessages().catch(console.error); 