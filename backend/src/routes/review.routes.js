const express = require('express');
const reviewController = require('../controllers/review.controller');
const { optionalProtect } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/create/:matchId')
  .post(optionalProtect, reviewController.createReview);

router.route('/status/:reviewId')
  .get(reviewController.getReviewStatus);

router.route('/match/:matchId')
  .get(reviewController.getReviewByMatch);

router.route('/:reviewId')
  .get(reviewController.getReview);

module.exports = router;
