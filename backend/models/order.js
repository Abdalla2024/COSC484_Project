const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema(
{
    status: { type: String, required: true }, // e.g., 'pending', 'completed'
    createdAt: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    listing: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    },
    seller: {
    name: { type: String, required: true },
    },
    meetupLocation: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
{ timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
