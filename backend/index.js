const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
const Listing = require('./models/listing')
const app = express()
// Add middleware
app.use(express.json())

app.post('/api/listing', async (req, res) => {
    try {
        const listing = await Listing.create(req.body)
        res.status(201).json(listing)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Hello World')
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err)
    })