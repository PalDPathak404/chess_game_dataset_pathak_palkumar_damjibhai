const express = require('express');
const chatController = require('../controllers/chat.controller');
const { optionalProtect } = require('../middleware/auth.middleware');

const router = express.Router();

// Session Management
router.post('/sessions', optionalProtect, chatController.createSession);
router.get('/sessions/:sessionId', chatController.getSession);

// Messaging
router.post('/sessions/:sessionId/messages', chatController.sendMessage);

module.exports = router;