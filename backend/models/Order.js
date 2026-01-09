const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cart: {
      type: Object,
      required: true,
    },

    selectedPackage: String,
    selectedMealType: String,

    guests: {
      type: Number,
      required: function () { return this.orderType === 'catering'; },
    },

    orderType: {
      type: String,
      enum: ["catering", "mealbox"],
      required: true,
    },

    pricePerPerson: {
      type: Number,
      required: function () { return this.orderType === "catering"; },
    },

    // MealBox-only
    mealBox: {
      quantity: {
        type: Number,
        required: function () {
          return this.orderType === "mealbox";
        },
      },
      pricePerBox: Number,
      items: [String],
      taxes: {
        cgst: Number,
        sgst: Number,
      },
    },
    deliveryDate: {
      type: Date,
      required: true,
    },

    deliveryLocation: {
      address: { type: String, required: true },
      landmark: String,
      city: String,
      pincode: String,
    },

    total: {
      type: Number,
      required: true,
    },

    // 🔐 PAYMENT DETAILS
    payment: {
      provider: {
        type: String,
        enum: ["razorpay"],
        default: "razorpay",
      },

      paymentId: {
        type: String,
        required: true,
      },

      orderId: {
        type: String,
        required: true,
      },

      signature: {
        type: String,
        required: true,
      },

      amount: {
        type: Number, // stored in rupees
        required: true,
      },

      currency: {
        type: String,
        default: "INR",
      },

      status: { type: String, enum: ["paid", "partial", "failed", "refunded"], default: "paid" },

      paidAt: {
        type: Date,
        default: Date.now,
      },
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
