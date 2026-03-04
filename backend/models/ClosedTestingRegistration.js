const mongoose = require('mongoose');

const ClosedTestingRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  deviceType: { 
    type: String, 
    enum: ['Android', 'iOS', 'Web', 'Other'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClosedTestingRegistration', ClosedTestingRegistrationSchema);
