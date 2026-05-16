const reviewService = require('../services/review.service');
const mongoose = require('mongoose');

const createReview = async (req, res) => {
  try {
    const { matchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid match ID format'
      });
    }

    const review = await reviewService.createReview(matchId, req.query.type);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

const getReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID format'
      });
    }

    const review = await reviewService.getReviewById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
};

const getReviewByMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid match ID format'
      });
    }

    const review = await reviewService.getReviewByMatch(matchId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'No review found for this match'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review for match',
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  getReview,
  getReviewByMatch
};
