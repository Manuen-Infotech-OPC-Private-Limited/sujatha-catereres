const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cart: {
    type: Object,
    required: true,
  },
  selectedPackage: String,
  selectedMealType: String,
  guests: Number,
  pricePerPerson: Number,
  deliveryDate: {
    type: Date,
    required: true,
  },
  total: Number,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
