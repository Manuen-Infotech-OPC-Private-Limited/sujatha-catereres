const express = require("express");
const Razorpay = require("razorpay");
const authenticateToken = require("../service/authToken");

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("⚡ Razorpay router initialized");

// --------------------------------------------------
// POST /api/payments/create-razorpay-order
// --------------------------------------------------
router.post("/create-razorpay-order", authenticateToken, async (req, res) => {
    // console.log("🔔 Incoming request to /create-razorpay-order");
    // console.log("Request body:", req.body);
    // console.log("Authenticated user:", req.user);

    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            // console.warn("⚠️ Invalid amount:", amount);
            return res.status(400).json({ error: "Invalid amount" });
        }

        // console.log(`💰 Creating Razorpay order for amount: ₹${amount}`);

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // rupees → paise
            currency: "INR",
            receipt: `order_${Date.now()}`,
            payment_capture: 1,
        });

        // console.log("✅ Razorpay order created successfully:", order);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });

        // console.log("📤 Response sent to client with order details");
    } catch (err) {
        // console.error("❌ Razorpay order creation error:", err);
        res.status(500).json({ error: `Failed to create Razorpay order: ${err.message}` });
    }
});

module.exports = router;
