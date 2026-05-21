const Game = require('../models/game.model');
const { parsePgn } = require('../utils/pgnParser');
const reviewService = require('./review.service');

const importPgn = async (rawPgn) => {
  const parsed = parsePgn(rawPgn);
  if (!parsed) return null;

  const match = await Game.create(parsed);
  return match;
};

const importPgnWithReview = async (rawPgn) => {
  const match = await importPgn(rawPgn);
  if (!match) return null;

  const review = await reviewService.createReview(match._id.toString());

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

module.exports = {
  importPgn,
  importPgnWithReview
};
