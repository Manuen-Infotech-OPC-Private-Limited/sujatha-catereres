const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const Visit = require("../models/Visit");
const ConsultationRequest = require("../models/ConsultationRequest");
const authenticateToken = require("../service/authToken");

const router = express.Router();

// GET /api/admin/analytics
router.get("/analytics", authenticateToken, async (req, res) => {
  try {
    // ---------- USERS ----------
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalRegularUsers = totalUsers - totalAdmins;

    // ---------- VISITS ----------
    const totalVisits = await Visit.countDocuments();
    const uniqueVisitors = await Visit.distinct("visitorId");

    // ---------- ORDERS ----------
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    // Orders by status
    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
    ]);

    // Monthly analytics
    const monthly = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Top 5 users by revenue
    const topUsers = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    // ---------- CONSULTATIONS ----------
    const totalConsultations = await ConsultationRequest.countDocuments();
    const consultationsByStatus = await ConsultationRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const consultationsByType = await ConsultationRequest.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent 5 orders & consultations
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email phone");

    const recentConsultations = await ConsultationRequest.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email phone");

    res.json({
      users: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
      },
      visits: {
        totalVisits,
        uniqueVisitors: uniqueVisitors.length,
      },
      orders: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        statusBreakdown,
        monthly,
        topUsers,
        recentOrders,
      },
      consultations: {
        totalConsultations,
        consultationsByStatus,
        consultationsByType,
        recentConsultations,
      },
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Analytics fetch failed" });
  }
});

module.exports = router;
