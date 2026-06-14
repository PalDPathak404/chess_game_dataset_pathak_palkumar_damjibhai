const Review = require('../models/review.model');
const Game = require('../models/game.model');
const mongoose = require('mongoose');
const { analyzeGame } = require('../utils/engineAnalysis');

const resolveMatch = async (matchId) => {
  if (mongoose.Types.ObjectId.isValid(matchId)) {
    const match = await Game.findById(matchId);
    if (match) return match;
  }
  return await Game.findOne({ gameId: matchId });
};

const PROGRESS_STAGES = [
  { progress: 10, delay: 200 },
  { progress: 25, delay: 400 },
  { progress: 50, delay: 600 },
  { progress: 75, delay: 500 },
  { progress: 90, delay: 300 },
  { progress: 100, delay: 200 }
];

const simulateAsyncProcessing = async (reviewId, match, reviewType) => {
  try {
    const startTime = Date.now();

    await Review.findByIdAndUpdate(reviewId, {
      status: 'processing',
      progress: 0,
      'processingTimestamps.processingStartedAt': new Date()
    });

    for (const stage of PROGRESS_STAGES) {
      await new Promise((resolve) => setTimeout(resolve, stage.delay));

      if (stage.progress < 100) {
        await Review.findByIdAndUpdate(reviewId, { progress: stage.progress });
      }
    }

    const engineConfig = {
      engine: 'knightly-sim-v2',
      depth: reviewType === 'tactical' ? 25 : 20
    };

    const { analyzedMoves, summary, engineMetadata } = analyzeGame(match.moves, engineConfig);
    const processingTimeMs = Date.now() - startTime;

    await Review.findByIdAndUpdate(reviewId, {
      status: 'completed',
      progress: 100,
      analyzedMoves,
      summary,
      'processingTimestamps.completedAt': new Date(),
      'processingMetadata.engine': engineMetadata.engine,
      'processingMetadata.engineVersion': engineMetadata.engineVersion,
      'processingMetadata.depth': engineMetadata.depth,
      'processingMetadata.nodesSearched': engineMetadata.nodesSearched,
      'processingMetadata.evaluationSource': engineMetadata.evaluationSource,
      'processingMetadata.confidence': engineMetadata.confidence,
      'processingMetadata.processingTimeMs': processingTimeMs
    });
  } catch (error) {
    await Review.findByIdAndUpdate(reviewId, {
      status: 'failed',
      errorMessage: error.message || 'Processing failed unexpectedly',
      'processingTimestamps.failedAt': new Date(),
      $inc: { retryCount: 1 }
    });
  }
};

const createReview = async (matchId, reviewType = 'full', userId = null) => {
  const match = await resolveMatch(matchId);
  if (!match) return null;

  const existingReview = await Review.findOne({
    match: match._id,
    reviewType,
    status: { $in: ['queued', 'processing', 'completed'] }
  });
  if (existingReview) return existingReview;

  const reviewPayload = {
    match: match._id,
    reviewType,
    status: 'queued',
    progress: 0,
    processingTimestamps: {
      queuedAt: new Date()
    }
  };

  if (userId) {
    reviewPayload.createdBy = userId;
  }

  const review = await Review.create(reviewPayload);

  simulateAsyncProcessing(review._id, match, reviewType);

  return review;
};

const getReviewById = async (reviewId) => {
  return await Review.findById(reviewId).populate('match', 'gameId players opening winner victoryStatus turns');
};

const getReviewByMatch = async (matchId) => {
  const match = await resolveMatch(matchId);
  if (!match) return null;
  return await Review.findOne({ match: match._id }).sort({ createdAt: -1 }).populate('match', 'gameId players opening winner victoryStatus turns');
};

const getReviewStatus = async (reviewId) => {
  return await Review.findById(reviewId).select('status progress processingTimestamps processingMetadata retryCount errorMessage reviewType match createdAt updatedAt');
};

module.exports = {
  createReview,
  getReviewById,
  getReviewByMatch,
  getReviewStatus
};
