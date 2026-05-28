const chatService = require('../services/chat.service');

const createSession = async (req, res) => {
  try {
    const { reviewId } = req.body;
    if (!reviewId) {
      return res.status(400).json({ success: false, message: 'reviewId is required' });
    }
    
    const session = await chatService.createSession(reviewId);
    
    res.status(201).json({ 
      success: true, 
      message: 'Chat session created',
      data: session 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create chat session', 
      error: error.message 
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const aiMessage = await chatService.sendMessage(sessionId, content);
    
    res.status(200).json({ 
      success: true, 
      data: aiMessage 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message', 
      error: error.message 
    });
  }
};

const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await chatService.getSession(sessionId);
    
    res.status(200).json({ 
      success: true, 
      data: session 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch chat session', 
      error: error.message 
    });
  }
};

module.exports = {
  createSession,
  sendMessage,
  getSession
};
