const express = require('express');
const authenticateToken = require('../service/authToken');
const Order = require('../models/Order');

const router = express.Router();

// POST /api/orders - Place order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { cart, selectedPackage, selectedMealType, guests, deliveryDate, pricePerPerson } = req.body;

    if (!cart || !guests || !pricePerPerson) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const newOrder = new Order({
      user: req.user.id,
      cart,
      selectedPackage,
      selectedMealType,
      guests,
      deliveryDate,
      pricePerPerson,
      total: pricePerPerson * guests,
    });

    const saved = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: saved });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /api/orders - Get orders for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
