// const express = require('express');
// const User = require('../models/User');
// const { sendOTP, verifyOTP } = require('../service/otpService');
// const jwt = require('jsonwebtoken');
// const authenticateToken = require('../service/authToken');

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || '123456';


// router.get('/me', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json({ user });
//   } catch (err) {
//     console.error('Error fetching user:', err);
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// });



// // Send OTP
// router.post('/send-otp', async (req, res) => {
//   const { phone } = req.body;
//   if (!phone) return res.status(400).json({ error: 'Phone number is required' });

//   try {
//     await sendOTP(phone);
//     res.json({ message: 'OTP sent' });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Failed to send OTP' });
//   }
// });

// // Verify OTP and issue JWT cookie
// router.post('/verify-otp', async (req, res) => {
//   const { phone, code } = req.body;
//   if (!phone || !code) return res.status(400).json({ error: 'Phone and OTP code are required' });

//   try {
//     const verification = await verifyOTP(phone, code);

//     if (verification.status !== 'approved') {
//       return res.status(400).json({ error: 'Invalid or expired OTP' });
//     }

//     let user = await User.findOne({ phone });

//     if (!user) {
//       user = new User({ phone });
//       await user.save();
//     }

//     const token = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '30d' });

//     res
//       .cookie('token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: process.env.JWT_EXPIRY * 1000 || 2592000000,
//         sameSite: 'strict',
//       })
//       .json({ message: 'Login successful', user });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'OTP verification failed' });
//   }
// });

// // Update user profile (protected)
// router.put('/update-profile', authenticateToken, async (req, res) => {
//   const { name, email, address } = req.body;
//   if (!name || !email) return res.status(400).json({ error: 'Missing required fields' });

//   try {
//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { name, email, ...(address && { address }) },
//       { new: true }
//     ).select('-password');

//     if (!user) return res.status(404).json({ error: 'User not found' });

//     res.json({ message: 'Profile updated', user });
//   } catch (err) {
//     console.error('Error updating profile:', err);
//     res.status(500).json({ error: 'Failed to update profile' });
//   }
// });

// // Get user by ID (protected)
// router.get('/:id', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get logged-in user's profile (protected)
// router.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Logout by clearing cookie
// router.post('/logout', (req, res) => {
//   res.clearCookie('token', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'Lax',
//   });
//   res.status(200).json({ message: 'Logged out' });
// });



// module.exports = router;


const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyFirebaseToken } = require("../service/firebaseAuth");
const authenticateToken = require("../service/authToken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "123456";

// =============================
// 🔹 Firebase-based login route
// =============================
router.post("/firebase-login", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "Firebase ID token required" });
  const isMobile = req.headers["x-client-type"] === "mobile";
  let isNewUser = false;
  try {
    // 1️⃣ Verify the Firebase token
    const decoded = await verifyFirebaseToken(idToken);
    const phone = decoded.phone_number;

    if (!phone) return res.status(400).json({ error: "Phone number missing" });

    // 2️⃣ Find or create the user in DB
    let user = await User.findOne({ phone });
    if (!user) { isNewUser = true; user = new User({ phone }); await user.save(); }

    // 3️⃣ Issue your own backend JWT (for sessions)
    const token = jwt.sign({ id: user._id, phone: user.phone, role: user.role }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "30d"
    });
    // --------------------------
    // 🔹 MOBILE CLIENT
    // --------------------------
    if (isMobile) {
      return res.json({
        message: "Login successful",
        token,
        user,
        isNewUser,
      });
    }

    // 4️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(401).json({ error: "Invalid or expired Firebase token" });
  }
});

// Save or update FCM token for logged-in user
router.post("/save-fcm-token", authenticateToken, async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ error: "FCM token is required" });
    }

    await User.findByIdAndUpdate(req.user.id, { fcmToken });

    res.json({ message: "FCM token saved successfully" });
  } catch (err) {
    console.error("Error saving FCM token:", err);
    res.status(500).json({ error: "Failed to save FCM token" });
  }
});


// Registration route
router.post("/register", async (req, res) => {
  const { name, email, address, idToken, fcmToken } = req.body;

  // Error codes dictionary (for API consumers)
  const ERROR_CODES = {
    MISSING_FIELDS: "ERR_MISSING_FIELDS",
    INVALID_TOKEN: "ERR_INVALID_TOKEN",
    PHONE_MISSING: "ERR_PHONE_MISSING",
    DUPLICATE_EMAIL: "ERR_DUPLICATE_EMAIL",
    DUPLICATE_PHONE: "ERR_DUPLICATE_PHONE",
    REGISTRATION_FAILED: "ERR_REGISTRATION_FAILED"
  };

  if (!idToken || !name || !email) {
    return res.status(400).json({
      error: "Missing required fields: name, email, or idToken",
      code: ERROR_CODES.MISSING_FIELDS
    });
  }

  const isMobile = req.headers["x-client-type"] === "mobile";

  try {
    // 1️⃣ Verify Firebase token
    const decoded = await verifyFirebaseToken(idToken).catch(() => null);
    if (!decoded) {
      return res.status(401).json({
        error: "Invalid Firebase token",
        code: ERROR_CODES.INVALID_TOKEN
      });
    }

    const phone = decoded.phone_number;
    if (!phone) {
      return res.status(400).json({
        error: "Phone number missing in Firebase token",
        code: ERROR_CODES.PHONE_MISSING
      });
    }

    // 2️⃣ Check if user exists by phone
    let user = await User.findOne({ phone });
    if (!user) {
      // Create new user
      user = new User({ name, email, phone, address, fcmToken });
      await user.save();
    } else {
      // Update existing user
      user.name = name;
      user.email = email;
      if (address) user.address = address;
      if (fcmToken) user.fcmToken = fcmToken;
      console.log(`Updating existing user: ${name} - ${email} - ${address}`);
      await user.save();
    }

    // 3️⃣ Issue JWT
    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Mobile response
    if (isMobile) {
      return res.json({
        message: "Registration successful",
        token,
        user
      });
    }

    // Web response with cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({ message: "Registration successful", user });
  } catch (err) {
    console.error("Registration failed:", err);

    // Handle duplicate key errors
    if (err.code === 11000) {
      if (err.keyPattern?.email) {
        return res.status(400).json({
          error: `Email "${err.keyValue.email}" is already registered. Please use a different email.`,
          code: ERROR_CODES.DUPLICATE_EMAIL
        });
      }
      if (err.keyPattern?.phone) {
        return res.status(400).json({
          error: `Phone number "${err.keyValue.phone}" is already registered.`,
          code: ERROR_CODES.DUPLICATE_PHONE
        });
      }
    }

    // Generic registration failure
    res.status(500).json({
      error: "Registration failed. Please try again.",
      code: ERROR_CODES.REGISTRATION_FAILED
    });
  }
});



// =============================
// 🔹 Protected routes
// =============================

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update user profile
router.put("/update-profile", authenticateToken, async (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1️⃣ Check if phone is being updated and already exists
    if (phone) {
      const existingPhoneUser = await User.findOne({ phone });
      if (existingPhoneUser && existingPhoneUser._id.toString() !== req.user.id) {
        return res.status(409).json({ error: "Phone number already in use" });
      }
    }

    // 2️⃣ Check if email is being updated and already exists
    if (email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser && existingEmailUser._id.toString() !== req.user.id) {
        return res.status(409).json({ error: "Email already in use" });
      }
    }

    // 3️⃣ Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, ...(phone && { phone }), ...(address && { address }) },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});


// Check if a phone number is already registered
router.post('/check-phone', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    const user = await User.findOne({ phone });

    if (req.query.for === 'login') {
      if (!user) return res.status(404).json({ error: 'Phone not registered' });
      return res.json({ message: 'Phone exists' });
    }

    // registration check
    if (req.query.for === 'register') {
      if (user) return res.status(409).json({ error: 'Phone already registered' });
      return res.json({ message: 'Phone available' });
    }

    res.json({ exists: !!user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Logout by clearing cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out" });
});

module.exports = router;
