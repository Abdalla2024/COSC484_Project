const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Frontend URL (not the API URL)
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://campusbazaar.vercel.app';

router.post('/create-checkout-session', async (req, res) => {
  const { id, title, price, cancel_url } = req.body;
  console.log("Incoming checkout data:", req.body); // Debugging

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: title },
          unit_amount: Math.round(Number(price) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${FRONTEND_URL}/order-confirmation/${id}`,
      cancel_url: cancel_url || `${FRONTEND_URL}/checkout/${id}`,
      metadata: {
        listingId: id,
        title,
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
