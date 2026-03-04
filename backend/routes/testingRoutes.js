const express = require('express');
const router = express.Router();
const ClosedTestingRegistration = require('../models/ClosedTestingRegistration');

// @route   POST /api/testing/register
// @desc    Register for closed testing
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, deviceType } = req.body;

    // Validation
    if (!name || !email || !phone || !deviceType) {
      return res.status(400).json({ error: 'Please provide all required fields (name, email, phone, deviceType)' });
    }

    // Check if already registered with this email or phone
    const existing = await ClosedTestingRegistration.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already registered for closed testing with this email or phone number.' });
    }

    const newRegistration = new ClosedTestingRegistration({
      name,
      email,
      phone,
      deviceType
    });

    await newRegistration.save();

    res.status(201).json({ 
      message: 'Thank you for registering for our closed testing phase! We will contact you soon with further details.' 
    });
  } catch (err) {
    console.error('Testing registration error:', err);
    res.status(500).json({ error: 'Failed to process registration. Please try again later.' });
  }
});

module.exports = router;
