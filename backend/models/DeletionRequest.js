const mongoose = require('mongoose');

const DeletionRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  reason: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processed', 'rejected'], 
    default: 'pending' 
  },
  requestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeletionRequest', DeletionRequestSchema);
