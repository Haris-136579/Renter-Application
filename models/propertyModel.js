const mongoose = require('mongoose');
const propertySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    pricePerMonth: {
      type: Number,
      required: true,
    },
    pictures: {
      type: [String], // Array of image URLs
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Property', propertySchema);
  