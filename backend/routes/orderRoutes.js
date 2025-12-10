const express = require('express');
const authenticateToken = require('../service/authToken');
const isAdmin = require('../service/isAdmin');

const Order = require('../models/Order');

const { sendPush } = require("../service/sendPush");
const { getFriendlyMessage } = require("../service/friendlyMessages");

const router = express.Router();

// POST /api/orders - Place order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { cart, selectedPackage, selectedMealType, guests, deliveryDate, pricePerPerson } = req.body;

    if (!cart || !guests || !pricePerPerson) {
      return res.status(400).json({ error: 'Missing required order details' });
    }
    // Convert deliveryDate to Date object
    const date = new Date(deliveryDate);

    // Apply delivery time based on selectedMealType
    switch (selectedMealType?.toLowerCase()) {
      case 'breakfast':
        date.setHours(7, 0, 0, 0);
        break;
      case 'lunch':
        date.setHours(11, 0, 0, 0);
        break;
      case 'dinner':
        date.setHours(19, 0, 0, 0);
        break;
      default:
        return res.status(400).json({ error: 'Invalid meal type' });
    }


    const newOrder = new Order({
      user: req.user.id,
      cart,
      selectedPackage,
      selectedMealType,
      guests,
      deliveryDate: date,
      pricePerPerson,
      total: pricePerPerson * guests,
    });

    const saved = await newOrder.save();
    const populated = await saved.populate("user", "name email");

    const io = req.app.get('io');
    if (io) {
      // Notify all admins that a new order has been created
      io.to('admins').emit('orderCreated', populated);

      // Also notify the specific user room (optional)
      io.to(String(saved.user)).emit('orderUpdated', populated);
    }

    res
      .status(201)
      .json({ message: 'Order placed successfully', order: saved });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /api/orders - Get orders for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const statusFilter = req.query.status;
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };

    if (statusFilter) query.status = statusFilter;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
      },
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/orders/:id/status - Admin only: update order status
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email fcmToken');

    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // SOCKET.IO notifications
    const io = req.app.get('io');
    if (io) {
      io.to('admins').emit('orderUpdated', updated);
      if (updated.user?._id) io.to(String(updated.user._id)).emit('orderUpdated', updated);
      else if (updated.user) io.to(String(updated.user)).emit('orderUpdated', updated);
    }

    // FRIENDLY FCM notification
    if (updated.user?.fcmToken) {
      const friendlyBody = getFriendlyMessage(status);

      sendPush(
        updated.user.fcmToken,
        "Order Update",
        friendlyBody,
        updated._id,
        { status }
      );
    }

    res.json({ message: 'Order status updated', order: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});


module.exports = router;
