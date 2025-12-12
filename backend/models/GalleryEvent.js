// models/GalleryEvent.js
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: { type: String },
  storagePath: { type: String },       // original file
  thumbStoragePath: { type: String },  // ⭐ thumbnail file
  url: { type: String },
  thumbUrl: { type: String },
  contentType: { type: String },
  size: { type: Number },
}, { _id: false });


const galleryEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  eventDate: Date,
  images: { type: [imageSchema], default: [] },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("GalleryEvent", galleryEventSchema);
