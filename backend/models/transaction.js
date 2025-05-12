const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentIntentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
    paymentMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;


//transaction schema
// const transactionSchema = new mongoose.Schema({
//     orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
//     buyerId: { type: Schema.Types.ObjectId, ref: 'User' },
//     paymentMethod: { type: String, enum: ['escrow', 'direct'], required: true },
//     amount: { type: Number, required: true },
//     status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
//     refundedAt: { type: Date } ,
//     refundAmount: { type: Number },
//     releasedAt: { type: Date },
//     createdAt: { type: Date, default: Date.now }
//   });