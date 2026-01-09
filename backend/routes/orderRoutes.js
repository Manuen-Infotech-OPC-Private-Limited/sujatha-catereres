// const express = require('express');
// const authenticateToken = require('../service/authToken');
// const isAdmin = require('../service/isAdmin');

// const Order = require('../models/Order');
// const crypto = require("crypto");

// const { sendPush } = require("../service/sendPush");
// const { getFriendlyMessage } = require("../service/friendlyMessages");

// const router = express.Router();

// // POST /api/orders - Place order
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const { cart, selectedPackage, selectedMealType, guests, deliveryDate, pricePerPerson, deliveryLocation, payment } = req.body;

//     if (!cart || !guests || !pricePerPerson || !deliveryLocation?.address || !payment) {
//       return res.status(400).json({ error: 'Missing required order details' });
//     }
//     // Convert deliveryDate to Date object
//     const date = new Date(deliveryDate);

//     const body = `${payment.orderId}|${payment.paymentId}`;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== payment.signature) {
//       return res.status(400).json({ error: "Invalid payment signature" });
//     }

//     // Apply delivery time based on selectedMealType
//     switch (selectedMealType?.toLowerCase()) {
//       case 'breakfast':
//         date.setHours(7, 0, 0, 0);
//         break;
//       case 'lunch':
//         date.setHours(11, 0, 0, 0);
//         break;
//       case 'dinner':
//         date.setHours(19, 0, 0, 0);
//         break;
//       default:
//         return res.status(400).json({ error: 'Invalid meal type' });
//     }


//     const newOrder = new Order({
//       user: req.user.id,
//       cart,
//       selectedPackage,
//       selectedMealType,
//       guests,
//       deliveryDate: date,
//       pricePerPerson,
//       deliveryLocation,

//       total: pricePerPerson * guests,
//       // ✅ PAYMENT INFO STORED
//       payment: {
//         provider: "razorpay",
//         paymentId: payment.paymentId,
//         orderId: payment.orderId,
//         signature: payment.signature,
//         status: "paid",
//       },
//     });

//     const saved = await newOrder.save();
//     const populated = await saved.populate("user", "name email");

//     const io = req.app.get('io');
//     if (io) {
//       // Notify all admins that a new order has been created
//       io.to('admins').emit('orderCreated', populated);

//       // Also notify the specific user room (optional)
//       io.to(String(saved.user)).emit('orderUpdated', populated);
//     }

//     res
//       .status(201)
//       .json({ message: 'Order placed successfully', order: saved });
//   } catch (err) {
//     console.error('Error placing order:', err);
//     res.status(500).json({ error: 'Failed to place order' });
//   }
// });

// // GET /api/orders - Get orders for logged-in user
// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 10;
//     const statusFilter = req.query.status;
//     const mealTypeFilter = req.query.mealType;
//     const packageFilter = req.query.package;
//     const query = req.user.role === 'admin' ? {} : { user: req.user.id };
//     // console.log(`Meal type: ${req.query.mealType}, Package: ${req.query.package}`);
//     if (statusFilter) query.status = statusFilter;
//     if (mealTypeFilter) query.selectedMealType = mealTypeFilter;
//     if (packageFilter) query.selectedPackage = packageFilter;


//     const orders = await Order.find(query)
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit).lean();

//     const total = await Order.countDocuments(query);
//     // console.log(`Order are: ${orders}`);
//     res.json({
//       orders,
//       pagination: {
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//         totalOrders: total,
//       },
//     });
//   } catch (err) {
//     console.error('Error fetching orders:', err.stack);
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// });

// // PATCH /api/orders/:id/status - Admin only: update order status
// router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'].includes(status)) {
//       return res.status(400).json({ error: 'Invalid status' });
//     }

//     const updated = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     ).populate('user', 'name email fcmToken');

//     if (!updated) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     // SOCKET.IO notifications
//     const io = req.app.get('io');
//     if (io) {
//       io.to('admins').emit('orderUpdated', updated);
//       if (updated.user?._id) io.to(String(updated.user._id)).emit('orderUpdated', updated);
//       else if (updated.user) io.to(String(updated.user)).emit('orderUpdated', updated);
//     }

//     // FRIENDLY FCM notification
//     if (updated.user?.fcmToken) {
//       const friendlyBody = getFriendlyMessage(status);

//       sendPush(
//         updated.user.fcmToken,
//         "Order Update",
//         friendlyBody,
//         updated._id,
//         { status }
//       );
//     }

//     res.json({ message: 'Order status updated', order: updated });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update order status' });
//   }
// });


// module.exports = router;



const express = require("express");
const authenticateToken = require("../service/authToken");
const isAdmin = require("../service/isAdmin");
const crypto = require("crypto");

const Order = require("../models/Order");
const { sendPush } = require("../service/sendPush");
const { getFriendlyMessage } = require("../service/friendlyMessages");

const router = express.Router();

// --------------------------------------------------
// POST /api/orders — Place order (after Razorpay payment)
// --------------------------------------------------
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const {
//       cart,
//       selectedPackage,
//       selectedMealType,
//       guests,
//       deliveryDate,
//       pricePerPerson,
//       deliveryLocation,
//       payment,
//     } = req.body;
//     const { orderType } = req.body;

//     if (
//       !cart ||
//       !guests ||
//       !pricePerPerson ||
//       !deliveryLocation?.address ||
//       !payment?.orderId ||
//       !payment?.paymentId ||
//       !payment?.signature ||
//       !payment?.amount
//     ) {
//       return res.status(400).json({ error: "Missing required order details" });
//     }

//     // --------------------------------------------------
//     // Razorpay signature verification
//     // --------------------------------------------------
//     const body = `${payment.orderId}|${payment.paymentId}`;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== payment.signature) {
//       return res.status(400).json({ error: "Invalid payment signature" });
//     }

//     // --------------------------------------------------
//     // Delivery time mapping
//     // --------------------------------------------------
//     const date = new Date(deliveryDate);

//     switch (selectedMealType?.toLowerCase()) {
//       case "breakfast":
//         date.setHours(7, 0, 0, 0);
//         break;
//       case "lunch":
//         date.setHours(11, 0, 0, 0);
//         break;
//       case "dinner":
//         date.setHours(19, 0, 0, 0);
//         break;
//       default:
//         return res.status(400).json({ error: "Invalid meal type" });
//     }

//     // --------------------------------------------------
//     // Save order
//     // --------------------------------------------------
//     const newOrder = new Order({
//       user: req.user.id,
//       cart,
//       selectedPackage,
//       selectedMealType,
//       guests,
//       deliveryDate: date,
//       pricePerPerson,
//       deliveryLocation,

//       // full bill amount (not just paid now)
//       total: payment.totalAmount || pricePerPerson * guests,

//       payment: {
//         provider: "razorpay",
//         paymentId: payment.paymentId,
//         orderId: payment.orderId,
//         signature: payment.signature,
//         amount: payment.amount, // paid now
//         currency: "INR",
//         status: payment.paidPercentage === 100 ? "paid" : "partial",
//         paidAt: new Date(),
//       },
//     });

//     const saved = await newOrder.save();
//     const populated = await saved.populate("user", "name email");

//     // --------------------------------------------------
//     // SOCKET.IO notifications
//     // --------------------------------------------------
//     const io = req.app.get("io");
//     if (io) {
//       io.to("admins").emit("orderCreated", populated);
//       io.to(String(saved.user)).emit("orderUpdated", populated);
//     }

//     res.status(201).json({
//       message: "Order placed successfully",
//       order: saved,
//     });
//   } catch (err) {
//     console.error("Error placing order:", err);
//     res.status(500).json({ error: "Failed to place order" });
//   }
// });

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      orderType, // "catering" | "mealbox"
      cart,
      selectedPackage,
      selectedMealType,
      guests,
      deliveryDate,
      pricePerPerson,
      deliveryLocation,
      mealBox,
      payment,
    } = req.body;

    if (!orderType) {
      return res.status(400).json({ error: "orderType is required" });
    }

    // --------------------------------------------------
    // Razorpay signature verification (COMMON)
    // --------------------------------------------------
    if (
      !payment?.orderId ||
      !payment?.paymentId ||
      !payment?.signature ||
      !payment?.amount
    ) {
      return res.status(400).json({ error: "Invalid payment details" });
    }

    const body = `${payment.orderId}|${payment.paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== payment.signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    let orderData = {
      user: req.user.id,
      orderType,
      deliveryLocation,
      payment: {
        provider: "razorpay",
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        signature: payment.signature,
        amount: payment.amount,
        currency: "INR",
        paidAt: new Date(),
      },
      status: "pending",
    };

    // ==================================================
    // 🥘 CATERING ORDER
    // ==================================================
    if (orderType === "catering") {
      if (
        !cart ||
        !guests ||
        !pricePerPerson ||
        !deliveryDate ||
        !deliveryLocation?.address
      ) {
        return res.status(400).json({ error: "Missing catering details" });
      }

      const date = new Date(deliveryDate);
      switch (selectedMealType?.toLowerCase()) {
        case "breakfast":
          date.setHours(7, 0, 0, 0);
          break;
        case "lunch":
          date.setHours(11, 0, 0, 0);
          break;
        case "dinner":
          date.setHours(19, 0, 0, 0);
          break;
        default:
          return res.status(400).json({ error: "Invalid meal type" });
      }

      const total = pricePerPerson * guests;

      orderData = {
        ...orderData,
        cart,
        selectedPackage,
        selectedMealType,
        guests,
        deliveryDate: date,
        pricePerPerson,
        total,
        payment: {
          ...orderData.payment,
          status: payment.amount >= total ? "paid" : "partial",
        },
      };
    }

    // ==================================================
    // 🍱 MEALBOX ORDER
    // ==================================================
    if (orderType === "mealbox") {
      if (
        !mealBox?.quantity ||
        !mealBox?.pricePerBox ||
        !deliveryLocation?.address
      ) {
        return res.status(400).json({ error: "Missing mealbox details" });
      }

      const subTotal = mealBox.quantity * mealBox.pricePerBox;
      const total =
        subTotal +
        (mealBox.taxes?.cgst || 0) +
        (mealBox.taxes?.sgst || 0);

      orderData = {
        ...orderData,
        cart: { items: mealBox.items || [] },
        mealBox,
        deliveryDate: new Date(), // or future slot if you add later
        total,
        payment: {
          ...orderData.payment,
          status: "paid",
        },
      };
    }

    // --------------------------------------------------
    // Save order
    // --------------------------------------------------
    const order = new Order(orderData);
    const saved = await order.save();
    const populated = await saved.populate("user", "name email");

    // --------------------------------------------------
    // SOCKET.IO notifications
    // --------------------------------------------------
    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("orderCreated", populated);
      io.to(String(saved.user)).emit("orderUpdated", populated);
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: populated,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// --------------------------------------------------
// GET /api/orders — User / Admin
// --------------------------------------------------
router.get("/", authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const query =
      req.user.role === "admin" ? {} : { user: req.user.id };

    // ✅ Filters
    if (req.query.status) query.status = req.query.status;
    if (req.query.orderType) query.orderType = req.query.orderType; // NEW
    if (req.query.mealType) query.selectedMealType = req.query.mealType;
    if (req.query.package) query.selectedPackage = req.query.package;

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

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
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
// POST /api/orders/:id/repay — Pay remaining amount
router.post("/:id/repay", authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { payment } = req.body;

    if (
      !payment?.orderId ||
      !payment?.paymentId ||
      !payment?.signature ||
      !payment?.amount
    ) {
      return res.status(400).json({ error: "Incomplete payment details" });
    }

    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ error: "Order not found" });

    // --------------------------------------------------
    // Verify Razorpay signature
    const body = `${payment.orderId}|${payment.paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== payment.signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // --------------------------------------------------
    // Update order payment
    const totalPaid = (order.payment.amount || 0) + payment.amount;
    order.payment.amount = totalPaid;
    order.payment.paymentId = payment.paymentId;
    order.payment.orderId = payment.orderId;
    order.payment.signature = payment.signature;
    order.payment.status =
      totalPaid >= order.total ? "paid" : "partial";
    order.payment.paidAt = new Date();

    // Optionally update order status
    // if (order.payment.status === "paid" && order.status === "pending") {
    //   order.status = "confirmed"; // valid enum
    // }

    const saved = await order.save();
    const populated = await saved.populate("user", "name email");

    // --------------------------------------------------
    // Notify via socket
    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("orderUpdated", populated);
      io.to(String(saved.user)).emit("orderUpdated", populated);
    }

    res.json({ message: "Payment updated successfully", order: populated });
  } catch (err) {
    console.error("Error updating partial payment:", err);
    res.status(500).json({ error: "Failed to update payment" });
  }
});

// --------------------------------------------------
// PATCH /api/orders/:id/status — Admin only
// --------------------------------------------------
router.patch("/:id/status", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "preparing", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email fcmToken");

    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }

    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("orderUpdated", updated);
      io.to(String(updated.user._id)).emit("orderUpdated", updated);
    }

    if (updated.user?.fcmToken) {
      sendPush(
        updated.user.fcmToken,
        "Order Update",
        getFriendlyMessage(status),
        updated._id,
        { status }
      );
    }

    res.json({ message: "Order status updated", order: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;
