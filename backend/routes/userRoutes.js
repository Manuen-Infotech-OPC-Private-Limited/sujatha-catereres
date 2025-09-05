const express = require('express');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('../service/otpService');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../service/authToken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || '123456';

// routes/userRoutes.js
// router.get('/me', authenticateToken, (req, res) => {
//   if (req.user) {
//     res.json({ user: req.user });
//   } else {
//     res.status(401).json({ message: 'Not authenticated' });
//   }
// });

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});



// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    await sendOTP(phone);
    res.json({ message: 'OTP sent' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP and issue JWT cookie
router.post('/verify-otp', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: 'Phone and OTP code are required' });

  try {
    const verification = await verifyOTP(phone, code);

    if (verification.status !== 'approved') {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '30d' });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: process.env.JWT_EXPIRY * 1000 || 2592000000,
        sameSite: 'strict',
      })
      .json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Update user profile (protected)
router.put('/update-profile', authenticateToken, async (req, res) => {
  const { name, email, address } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, ...(address && { address }) },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user by ID (protected)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get logged-in user's profile (protected)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout by clearing cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });
  res.status(200).json({ message: 'Logged out' });
});



module.exports = router;
