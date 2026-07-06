const express = require('express');
const authController = require('../controllers/auth.controller');
const reviewController = require('../controllers/review.controller');
const chatController = require('../controllers/chat.controller');
const importController = require('../controllers/import.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.get('/my-reviews', protect, reviewController.getUserReviews);
router.get('/my-chats', protect, chatController.getMyChats);
router.get('/my-imports', protect, importController.getMyImports);

module.exports = router;
