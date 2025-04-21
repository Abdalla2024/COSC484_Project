const { id } = require('date-fns/locale');
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  rating: { type: Number, default: 0 },
  profileImage: {type:String, default: 'https://i.imgur.com/3g7nmJC.jpg'},
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
  messages: [{
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now }
});

// Listing Schema
const listingSchema = new mongoose.Schema({
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, 
    enum:["Textbooks",
  "Electronics",
  "Furniture",
  "Clothing",
  "School Supplies",
  "Dorm Essentials",
  "Sports Equipment",
  "Musical Instruments",
  "Art Supplies",
  "Lab Equipment"],
    required: true },
  condition: { type: String,
     enum: ['new', 'like new', 'good', 'fair', 'poor'],
     required: true },
  images: [String],
  deliveryMethod: { 
    type: String, 
    enum: ['Shipping', 'Meetup', 'Both'],
    required: true 
  },
  meetupLocation: String,
  status: { 
    type: String, 
    enum: ['active', 'sold', 'pending'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  highestBid: { type: Number, default: 0 },
  bids: [{
    bidderId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Order Schema
const orderSchema = new mongoose.Schema({
  listingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Listing',
    required: true 
  },
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  total: { type: Number, required: true },
  paymentType: { 
    type: String, 
    enum: ['escrow', 'direct'],
    required: true 
  },
  meetupLocation: String,
  deliveryMethod: {
    type: String,
    enum: ['Shipping', 'Meetup'],
    required: true
  },
  isRated: { type: Boolean, default: false },
  sellerConfirmed: { type: Boolean, default: false },
  buyerConfirmed: { type: Boolean, default: false },
  isConfirmed: { type: Boolean, default: false },
  isDisputed: { type: Boolean, default: false },
  autoConfirmAt: { type: Date },
  isAutoConfirmed: { type: Boolean, default: false },
  notes: { type: String }   
}, { timestamps: true });

// Review Schema
const reviewSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true 
  },
  reviewerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  targetUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: String
}, { timestamps: true });

// Create models
const User = mongoose.model('User', userSchema);
const Listing = mongoose.model('Listing', listingSchema);
const Order = mongoose.model('Order', orderSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = {
  User,
  Listing,
  Order,
  Review
};
