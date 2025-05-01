const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
const Listing = require('./models/listing')
const listingRoutes = require('./routes/listing.route')

const app = express()

// Configure CORS with specific options
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Enable credentials (cookies, authorization headers, etc)
}));

// Add middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Use the listing routes
app.use('/api/listing', listingRoutes)

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