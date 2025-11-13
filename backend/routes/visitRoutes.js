const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const { v4: uuidv4 } = require('uuid');

// GET /api/visit
router.get('/', async (req, res) => {
  try {
    let { visitorId } = req.cookies;

    if (!visitorId) {
      // First-time visitor
      visitorId = uuidv4();

      // Save in DB
      await Visit.create({ visitorId });

      // Set cookie (expires in 1 year)
      res.cookie('visitorId', visitorId, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      });
    }

    // Count unique visitors
    const count = await Visit.countDocuments();

    res.status(200).json({ count });
  } catch (err) {
    console.error('Visit tracking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
