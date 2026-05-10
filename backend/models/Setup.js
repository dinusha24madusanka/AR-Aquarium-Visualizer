const mongoose = require('mongoose');

const setupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'My Aquarium Setup'
  },
  dimensions: {
    width: Number,
    height: Number,
    depth: Number
  },
  tankVolume: String,
  lighting: String,
  filtration: String,
  substrate: String,
  plants: String,
  fishCapacity: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Setup', setupSchema);
