const mongoose = require("mongoose");

const ConsultationRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: ["offline", "online"],
            required: true,
        },

        name: String,
        email: String,
        phone: String,
        address: String,

        eventType: { type: String, required: true },
        guests: { type: Number },
        notes: { type: String },

        // Only for online consulting
        preferredDate: { type: Date },
        preferredTime: { type: String },

        // For offline distance logic
        isServiceArea: { type: Boolean, default: false },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ConsultationRequest", ConsultationRequestSchema);
