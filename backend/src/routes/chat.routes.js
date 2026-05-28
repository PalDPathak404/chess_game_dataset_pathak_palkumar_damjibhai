const express = require('express');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

// Session Management
router.post('/sessions', chatController.createSession);
router.get('/sessions/:sessionId', chatController.getSession);

// Messaging
router.post('/sessions/:sessionId/messages', chatController.sendMessage);

module.exports = router;
