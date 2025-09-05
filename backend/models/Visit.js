const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Visit', visitSchema);
