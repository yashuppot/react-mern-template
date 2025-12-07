const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 1200,
    index: true
  },
  ratingHistory: [{
    rating: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
