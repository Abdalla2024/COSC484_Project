import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'cosc484project';

async function checkData() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // Check users
    const users = await db.collection('users').find().toArray();
    console.log('Users in database:');
    console.log(JSON.stringify(users, null, 2));

    // Check messages
    const messages = await db.collection('messages').find().toArray();
    console.log('\nMessages in database:');
    console.log(JSON.stringify(messages, null, 2));

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await client.close();
  }
}

checkData(); 