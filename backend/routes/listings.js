const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure this according to your needs

router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    // Handle the listing creation
    const listing = new Listing({
      ...req.body,
      images: req.files.map(file => file.path) // Save file paths
    });
    
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}); 