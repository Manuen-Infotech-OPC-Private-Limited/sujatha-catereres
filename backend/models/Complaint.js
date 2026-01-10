const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },       // auto timestamp
  status: { type: String, default: 'pending' },  // default status
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
