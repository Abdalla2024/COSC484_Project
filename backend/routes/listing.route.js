const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// Get all listings
router.get('/', async (req, res) => {  
    try {
        const ListingModel = req.db.model('Listing', Listing.schema);
        const listings = await ListingModel.find();
        res.status(200).json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create a new listing
router.post('/', async (req, res) => {
    try {
        const ListingModel = req.db.model('Listing', Listing.schema);
        const listing = await ListingModel.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get a listing by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ListingModel = req.db.model('Listing', Listing.schema);
        const listing = await ListingModel.findById(id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update a listing by id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ListingModel = req.db.model('Listing', Listing.schema);
        const listing = await ListingModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete a listing by id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ListingModel = req.db.model('Listing', Listing.schema);
        const listing = await ListingModel.findByIdAndDelete(id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 