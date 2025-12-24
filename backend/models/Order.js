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
  deliveryLocation: {
    address: {
      type: String,
      required: true,
    },
    landmark: String,
    city: String,
    pincode: String,
  },
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'],
    default: 'pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
