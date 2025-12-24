const mongoose = require("mongoose");
const Category = require("./category"); // import Category model

const MenuItemSchema = new mongoose.Schema(
    {
        mealType: {
            type: String,
            enum: ["Breakfast", "Lunch", "Dinner"],
            required: true,
        },

        // Reference Category by ObjectId
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },

        packages: {
            type: [String],
            enum: ["Basic", "Classic", "Premium", "Luxury"],
            default: [],
        },

        image: String,

        autoInclude: Boolean,
        selectableGroup: String,

        isEnabled: {
            type: Boolean,
            default: true,
        },

        isOutOfStock: {
            type: Boolean,
            default: false,
        },

        hiddenCategory: {
            type: Boolean,
            default: false,
        },

        availableDates: {
            type: [Date], // optional
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);
