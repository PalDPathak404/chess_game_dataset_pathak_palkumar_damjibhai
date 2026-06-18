const reviewService = require('../services/review.service');

const createReview = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user?._id;

    const review = await reviewService.createReview(matchId, req.query.type, userId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const isNew = review.status === 'queued' && review.progress === 0;

    res.status(isNew ? 202 : 200).json({
      success: true,
      message: isNew ? 'Review queued for processing' : 'Review already exists',
      data: {
        reviewId: review._id,
        status: review.status,
        progress: review.progress,
        reviewType: review.reviewType
      }
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

const getReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const status = await reviewService.getReviewStatus(reviewId);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review status',
      error: error.message
    });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviews = await reviewService.getReviewsByUser(userId);

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews',
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  getReview,
  getReviewByMatch,
  getReviewStatus,
  getUserReviews
};
