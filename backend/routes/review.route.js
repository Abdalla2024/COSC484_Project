const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/review');
const User = require('../models/user');

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().populate('reviewerId', 'username displayName photoURL');
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create or update a review
router.post('/', async (req, res) => {
    try {
        const { reviewerId, sellerId, listingId, rating, content, title } = req.body;
        
        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(reviewerId) || !mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        
        if (listingId && !mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({ error: 'Invalid listing ID format' });
        }
        
        // Convert IDs to ObjectIds
        const reviewerObjectId = new mongoose.Types.ObjectId(reviewerId);
        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
        const listingObjectId = listingId ? new mongoose.Types.ObjectId(listingId) : null;
        
        // Create review data
        const reviewData = {
            rating,
            content,
            title,
            verified: false,
            updatedAt: new Date()
        };
        
        if (listingObjectId) {
            reviewData.listingId = listingObjectId;
        }
        
        // Check if reviewer has already reviewed this seller/listing
        const existingReview = await Review.findOne({
            reviewerId: reviewerObjectId,
            sellerId: sellerObjectId,
            ...(listingObjectId ? { listingId: listingObjectId } : {})
        });
        
        let review;
        
        if (existingReview) {
            console.log(`User ${reviewerId} already reviewed seller ${sellerId}, updating existing review`);
            
            // Update the existing review
            review = await Review.findByIdAndUpdate(
                existingReview._id, 
                { $set: reviewData }, 
                { new: true }
            );
            
            res.status(200).json({
                ...review.toObject(),
                wasUpdated: true
            });
        } else {
            console.log(`Creating new review from user ${reviewerId} for seller ${sellerId}`);
            
            // Create a new review
            reviewData.reviewerId = reviewerObjectId;
            reviewData.sellerId = sellerObjectId;
            reviewData.createdAt = new Date();
            
            review = await Review.create(reviewData);
            
            res.status(201).json({
                ...review.toObject(),
                wasUpdated: false
            });
        }
        
        // Update the seller's average rating
        await updateSellerRating(sellerObjectId);
    } catch (error) {
        console.error('Error creating/updating review:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all reviews for a specific seller
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const { sellerId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ error: 'Invalid seller ID format' });
        }
        
        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
        
        const reviews = await Review.find({ sellerId: sellerObjectId })
            .populate('reviewerId', 'username displayName photoURL')
            .sort({ createdAt: -1 });
            
        console.log(`Found ${reviews.length} reviews for seller ${sellerId}`);
        
        res.status(200).json(reviews);
    } catch (error) {
        console.error(`Error fetching reviews for seller: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Get all reviews written by a specific user
router.get('/reviewer/:reviewerId', async (req, res) => {
    try {
        const { reviewerId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(reviewerId)) {
            return res.status(400).json({ error: 'Invalid reviewer ID format' });
        }
        
        const reviewerObjectId = new mongoose.Types.ObjectId(reviewerId);
        
        const reviews = await Review.find({ reviewerId: reviewerObjectId })
            .populate('sellerId', 'username displayName photoURL')
            .sort({ createdAt: -1 });
            
        console.log(`Found ${reviews.length} reviews written by user ${reviewerId}`);
        
        res.status(200).json(reviews);
    } catch (error) {
        console.error(`Error fetching reviews by reviewer: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Get reviews for a specific listing
router.get('/listing/:listingId', async (req, res) => {
    try {
        const { listingId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({ error: 'Invalid listing ID format' });
        }
        
        const listingObjectId = new mongoose.Types.ObjectId(listingId);
        
        const reviews = await Review.find({ listingId: listingObjectId })
            .populate('reviewerId', 'username displayName photoURL')
            .sort({ createdAt: -1 });
            
        console.log(`Found ${reviews.length} reviews for listing ${listingId}`);
        
        res.status(200).json(reviews);
    } catch (error) {
        console.error(`Error fetching reviews for listing: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Update a review
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, content, title } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid review ID format' });
        }
        
        const reviewObjectId = new mongoose.Types.ObjectId(id);
        
        const review = await Review.findById(reviewObjectId);
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        // Update the review fields
        review.rating = rating || review.rating;
        review.content = content || review.content;
        review.title = title !== undefined ? title : review.title;
        
        // Save the updated review
        await review.save();
        
        // Update the seller's average rating
        await updateSellerRating(review.sellerId);
        
        res.status(200).json(review);
    } catch (error) {
        console.error(`Error updating review: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Delete a review
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid review ID format' });
        }
        
        const reviewObjectId = new mongoose.Types.ObjectId(id);
        
        const review = await Review.findById(reviewObjectId);
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        // Store the seller ID before deleting
        const sellerId = review.sellerId;
        
        // Delete the review
        await Review.findByIdAndDelete(reviewObjectId);
        
        // Update the seller's average rating
        await updateSellerRating(sellerId);
        
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(`Error deleting review: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Utility function to update a seller's average rating
async function updateSellerRating(sellerId) {
    try {
        // Calculate average rating
        const result = await Review.aggregate([
            { $match: { sellerId: sellerId } },
            { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
        ]);
        
        const averageRating = result.length > 0 ? result[0].averageRating : 0;
        const reviewCount = result.length > 0 ? result[0].count : 0;
        
        console.log(`Updating seller ${sellerId} rating to ${averageRating} from ${reviewCount} reviews`);
        
        // Update the user's rating field
        await User.findByIdAndUpdate(sellerId, { 
            rating: averageRating,
            reviewCount: reviewCount
        });
        
        return averageRating;
    } catch (error) {
        console.error(`Error updating seller rating: ${error.message}`);
        throw error;
    }
}

module.exports = router; 