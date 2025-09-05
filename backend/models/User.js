const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  address: { type: String }, // ✅ make sure this is included

  // other fields...
});

module.exports = mongoose.model('User', userSchema, "users");
