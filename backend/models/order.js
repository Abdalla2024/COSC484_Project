const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema(
{
    id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    status: { type: String, required: true },
    total: { type: Number, required: true },
    listing: {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    },
    meetupLocation: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    },
{ timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

// const orderExample = {
//     id: "string", // Auto-generated
//     listingId: "string", // Reference to listing.id
//     buyerId: "string", // Reference to user.id
//     sellerId: "string", // Reference to user.id
//     status: "string", // "pending", "completed", "cancelled"
//     total: "number",
//     meetupLocation: "string",
//     createdAt: "timestamp",
//     updatedAt: "timestamp"
//   };