const express = require('express');
const chatController = require('../controllers/chat.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/sessions', optionalAuth, chatController.createSession);
router.get('/sessions/:sessionId', chatController.getSession);

router.post('/sessions/:sessionId/messages', chatController.sendMessage);

module.exports = router;