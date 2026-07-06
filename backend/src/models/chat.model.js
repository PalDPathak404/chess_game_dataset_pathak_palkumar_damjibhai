const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ['user', 'assistant', 'system'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  context: {
    referencedMove: { type: Number },
    coachingCategory: { type: String }
  }
}, { 
  timestamps: true 
});

const chatSessionSchema = new mongoose.Schema({
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active',
    index: true
  },
  messages: [messageSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  }
}, { 
  timestamps: true 
});

// Index for quickly retrieving the most recent chat for a review
chatSessionSchema.index({ review: 1, createdAt: -1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
