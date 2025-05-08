const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema ({
    senderID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    receiverID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content:{ type : String},
    type: { type: String, enum: ['text', 'image', 'offer'], default: 'text' },
    payload: { type: Schema.Types.Mixed }, 
    read: {type : Boolean, default: false}
}, {timestamps : true});

const conversationSchema = new Schema({
    users : [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    lastMessage : {
        content: {type: String},
        senderID: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: Date
    },
    messages : [messageSchema]
}, {timestamps: true});

module.exports = mongoose.model('Conversation',conversationSchema);