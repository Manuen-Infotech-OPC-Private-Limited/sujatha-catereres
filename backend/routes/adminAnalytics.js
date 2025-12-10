const express = require("express");
const Order = require("../models/Order");
const authenticateToken = require("../service/authToken");

const router = express.Router();

// GET /api/admin/analytics
router.get("/analytics", authenticateToken, async (req, res) => {
  try {
    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total revenue
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Monthly analytics
    const monthly = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
          revenue: { $sum: "$total" },
        }
      }
    ]);

    res.json({
      totalOrders,
      totalRevenue,
      monthly
    });

  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Analytics fetch failed" });
  }
});

module.exports = router;
