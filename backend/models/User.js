const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  address: { type: String }, // ✅ make sure this is included
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  fcmToken: { type: String, default: null },


  // other fields...
});

module.exports = mongoose.model('User', userSchema, "users");
