const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
        ref: 'User'
    },
    receiverId: {
        type: String,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 