const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  company: {
    type: String,
    default: 'Independent'
  },
  accountType: {
    type: String,
    enum: ['Starter', 'Professional', 'Enterprise'],
    default: 'Professional'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);
