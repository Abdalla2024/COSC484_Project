const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI;

async function updateUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      // Update user with default values for missing fields
      user.username = user.username || user.email.split('@')[0];
      user.listings = user.listings || [];
      user.reviews = user.reviews || [];
      user.rating = user.rating || 0;
      user.favorites = user.favorites || [];
      user.messages = user.messages || [];
      user.photoURL = user.photoURL || '';

      await user.save();
      console.log(`Updated user: ${user.email}`);
    }

    console.log('All users updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
}

updateUsers(); 