
const express = require("express");
const router = express.Router();
const Complaint = require('../models/Complaint');

// Create a new complaint
router.post('/register-complaint', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newComplaint = new Complaint({ name, email, phone, message });
        await newComplaint.save();

        res.status(200).json({ message: 'Complaint submitted successfully' });
    } catch (err) {
        console.error('Error saving complaint:', err);
        res.status(500).json({ error: 'Failed to save complaint' });
    }
});

module.exports = router;
