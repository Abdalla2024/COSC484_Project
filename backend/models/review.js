const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  // The user who is writing the review
  reviewerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // The user who is being reviewed (usually a seller)
  sellerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Optional: The listing that this review is related to
  listingId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Listing'
  },
  
  // Rating from 1-5 stars
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  
  // Review text content
  content: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  
  // Additional properties
  title: { 
    type: String, 
    maxlength: 100
  },
  
  // Was the review verified (e.g., confirmed purchase)
  verified: { 
    type: Boolean, 
    default: false 
  },
  
  // Has the review been reported
  reported: { 
    type: Boolean, 
    default: false 
  },
  
  // Any helpful votes
  helpfulVotes: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

// Create a compound index to prevent duplicate reviews from the same reviewer to the same seller
reviewSchema.index({ reviewerId: 1, sellerId: 1, listingId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 