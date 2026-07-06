const Game = require('../models/game.model');
const { parsePgn } = require('../utils/pgnParser');
const reviewService = require('./review.service');

const importPgn = async (rawPgn, userId = null) => {
  const parsed = parsePgn(rawPgn);
  if (!parsed) return null;

  if (userId) {
    parsed.importMetadata = parsed.importMetadata || {};
    parsed.importMetadata.importedByUser = userId;
  }

  const match = await Game.create(parsed);
  return match;
};

const importPgnWithReview = async (rawPgn, userId = null) => {
  const match = await importPgn(rawPgn, userId);
  if (!match) return null;

  const review = await reviewService.createReview(match._id.toString(), 'full', userId);

  return {
    match,
    review: {
      reviewId: review._id,
      status: review.status,
      progress: review.progress,
      reviewType: review.reviewType
    }
  };
};

const getImportsByUser = async (userId) => {
  return Game.find({ sourceType: 'imported', 'importMetadata.importedByUser': userId })
    .select('gameId players opening turns winner victoryStatus importMetadata.importedAt importMetadata.site importMetadata.event sourceType createdAt')
    .sort({ createdAt: -1 })
    .lean();
};

module.exports = {
  importPgn,
  importPgnWithReview,
  getImportsByUser
};
