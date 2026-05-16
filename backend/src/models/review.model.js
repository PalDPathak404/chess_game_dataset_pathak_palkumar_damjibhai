const mongoose = require('mongoose');

const moveAnalysisSchema = new mongoose.Schema({
  moveNumber: { type: Number, required: true },
  notation: { type: String, required: true },
  player: { type: String, enum: ['white', 'black'], required: true },
  evaluation: { type: Number, default: 0 },
  classification: {
    type: String,
    enum: ['brilliant', 'great', 'good', 'book', 'inaccuracy', 'mistake', 'blunder', 'neutral'],
    default: 'neutral'
  },
  explanation: { type: String, default: '' },
  suggestedMove: { type: String, default: '' }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
    index: true
  },
  reviewType: {
    type: String,
    enum: ['full', 'opening', 'endgame', 'tactical'],
    default: 'full'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  analyzedMoves: [moveAnalysisSchema],
  summary: {
    totalMoves: { type: Number, default: 0 },
    brilliantMoves: { type: Number, default: 0 },
    greatMoves: { type: Number, default: 0 },
    goodMoves: { type: Number, default: 0 },
    inaccuracies: { type: Number, default: 0 },
    mistakes: { type: Number, default: 0 },
    blunders: { type: Number, default: 0 },
    openingAccuracy: { type: String, default: '' },
    endgameAccuracy: { type: String, default: '' },
    keyInsights: [{ type: String }]
  }
}, {
  timestamps: true
});

reviewSchema.index({ match: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
