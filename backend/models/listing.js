// models/listing.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const listingSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  title:     { type: String, required: true },
  description:{ type: String, required: true },
  price:     { type: Number, required: true },
  category:  { 
    type: String,
    enum: [
      "Textbooks","Electronics","Furniture","Clothing",
      "School Supplies","Dorm Essentials","Sports Equipment",
      "Musical Instruments","Art Supplies","Lab Equipment"
    ],
    required: true
  },
  condition: { type: String, enum: ['new','like new','good','fair','poor'], required: true },
  images:    [String],
  deliveryMethod: { type: String, enum: ['Shipping','Meetup','Both'], required: true },
  meetupLocation: String,
  status:    { type: String, enum: ['active','sold','pending'], default: 'active' },
  highestBid:{ type: Number, default: 0 },
  bids: [{
    bidderId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount:   { type: Number, required: true },
    timestamp:{ type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
