const Listing = require('../models/Listing');
const createListing = async (req, res) => {
    try {
      const listing = new Listing(req.body);
      await listing.save();
      res.status(201).json(listing);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const getAllListings = async (req, res) => {
    try {
      const listings = await Listing.find();
      res.json(listings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  module.exports = { createListing, getAllListings };