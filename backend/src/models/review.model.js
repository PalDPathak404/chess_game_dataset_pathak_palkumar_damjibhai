const mongoose = require('mongoose');

const moveAnalysisSchema = new mongoose.Schema({
  moveNumber: { type: Number, required: true },
  notation: { type: String, required: true },
  player: { type: String, enum: ['white', 'black'], required: true },
  evaluation: { type: Number, default: 0 },
  classification: {
    type: String,
    enum: ['brilliant', 'great', 'best', 'good', 'book', 'forced', 'inaccuracy', 'mistake', 'blunder', 'neutral'],
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
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued',
    index: true
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  analyzedMoves: [moveAnalysisSchema],
  summary: {
    totalMoves: { type: Number, default: 0 },
    brilliantMoves: { type: Number, default: 0 },
    greatMoves: { type: Number, default: 0 },
    bestMoves: { type: Number, default: 0 },
    goodMoves: { type: Number, default: 0 },
    bookMoves: { type: Number, default: 0 },
    forcedMoves: { type: Number, default: 0 },
    inaccuracies: { type: Number, default: 0 },
    mistakes: { type: Number, default: 0 },
    blunders: { type: Number, default: 0 },
    openingAccuracy: { type: String, default: '' },
    endgameAccuracy: { type: String, default: '' },
    keyInsights: [{ type: String }]
  },
  processingTimestamps: {
    queuedAt: { type: Date },
    processingStartedAt: { type: Date },
    completedAt: { type: Date },
    failedAt: { type: Date }
  },
  processingMetadata: {
    engine: { type: String, default: '' },
    engineVersion: { type: String, default: '' },
    depth: { type: Number, default: 0 },
    nodesSearched: { type: Number, default: 0 },
    evaluationSource: { type: String, default: '' },
    confidence: { type: Number, default: 0, min: 0, max: 1 },
    processingTimeMs: { type: Number, default: 0 },
    workerId: { type: String, default: '' }
  },
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  errorMessage: { type: String, default: '' }
}, {
  timestamps: true
});

reviewSchema.index({ match: 1, createdAt: -1 });
reviewSchema.index({ status: 1, createdAt: 1 });

module.exports = mongoose.model('Review', reviewSchema);
