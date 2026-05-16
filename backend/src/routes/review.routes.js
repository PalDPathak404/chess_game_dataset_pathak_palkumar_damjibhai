const express = require('express');
const reviewController = require('../controllers/review.controller');

const router = express.Router();

router.route('/create/:matchId')
  .post(reviewController.createReview);

router.route('/match/:matchId')
  .get(reviewController.getReviewByMatch);

router.route('/:reviewId')
  .get(reviewController.getReview);

module.exports = router;
