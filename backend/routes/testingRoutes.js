const express = require('express');
const router = express.Router();
const ClosedTestingRegistration = require('../models/ClosedTestingRegistration');
const { sendApprovalEmail } = require('../service/emailService');
const authenticateToken = require('../service/authToken');
const isAdmin = require('../service/isAdmin');

// @route   POST /api/testing/register
// @desc    Register for closed testing (Public)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, deviceType } = req.body;

    if (!name || !email || !phone || !deviceType) {
      return res.status(400).json({ error: 'Please provide all required fields (name, email, phone, deviceType)' });
    }

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

// @route   GET /api/testing/registrations
// @desc    Get all testing registrations (Admin only)
// @access  Admin
router.get('/registrations', authenticateToken, isAdmin, async (req, res) => {
  try {
    const registrations = await ClosedTestingRegistration.find().sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// @route   PATCH /api/testing/registrations/:id/status
// @desc    Update registration status (approve/reject) (Admin only)
// @access  Admin
router.patch('/registrations/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const registration = await ClosedTestingRegistration.findById(id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    registration.status = status;
    await registration.save();

    if (status === 'approved') {
      try {
        await sendApprovalEmail(registration.email, registration.name);
      } catch (emailErr) {
        console.error('Status updated but email failed:', emailErr);
        return res.json({ 
          message: `Registration approved, but failed to send email to ${registration.email}`,
          data: registration 
        });
      }
    }

    res.json({ message: `Registration ${status} successfully`, data: registration });
  } catch (err) {
    console.error('Error updating registration status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
