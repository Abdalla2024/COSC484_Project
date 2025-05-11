require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cosc484';
const ABDALLA_MONGO_ID = '680c2e8517afa46b5ace56eb';

async function deleteSelfMessages() {
  // Connect to database
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log('Connected successfully');
  
  const db = client.db();
  const messagesCollection = db.collection('messages');
  
  // Find self-messages for Abdalla before deletion
  const abdallaId = new ObjectId(ABDALLA_MONGO_ID);
  const selfMessages = await messagesCollection.find({
    senderId: abdallaId,
    receiverId: abdallaId
  }).toArray();
  
  console.log(`Found ${selfMessages.length} self-messages for Abdalla before deletion`);
  
  // Display these messages before deleting
  if (selfMessages.length > 0) {
    console.log('\n--- SELF-MESSAGES TO DELETE ---');
    for (let i = 0; i < selfMessages.length; i++) {
      const msg = selfMessages[i];
      console.log(`Message ${i+1}:`);
      console.log(`  ID: ${msg._id}`);
      console.log(`  Content: ${msg.content}`);
      console.log(`  Timestamp: ${msg.timestamp}`);
    }
    
    // Confirm and delete
    console.log(`\nDeleting ${selfMessages.length} self-messages...`);
    
    const result = await messagesCollection.deleteMany({
      senderId: abdallaId,
      receiverId: abdallaId
    });
    
    console.log(`Deletion result: ${result.deletedCount} messages deleted`);
    
    // Verify deletion
    const remainingSelfMessages = await messagesCollection.find({
      senderId: abdallaId,
      receiverId: abdallaId
    }).toArray();
    
    console.log(`Remaining self-messages after deletion: ${remainingSelfMessages.length}`);
  } else {
    console.log('No self-messages found to delete');
  }
  
  // Close connection
  await client.close();
  console.log('\nConnection closed');
}

// Run the deletion process
deleteSelfMessages().catch(console.error); 