const express = require('express');
const authController = require('../controllers/auth.controller');
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.get('/my-reviews', protect, reviewController.getUserReviews);

module.exports = router;
