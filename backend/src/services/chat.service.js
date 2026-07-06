const ChatSession = require('../models/chat.model');
const Review = require('../models/review.model');
const { generateMockedResponse } = require('../utils/aiResponse.util');

const createSession = async (reviewId, userId = null) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error('Review not found');

  const sessionPayload = {
    review: reviewId,
    messages: [
      {
        role: 'system',
        content: 'You are Knightly, a helpful, beginner-friendly AI chess coach. Keep explanations simple and encouraging.',
        context: { coachingCategory: 'system' }
      },
      {
        role: 'assistant',
        content: 'Hello! I have reviewed your game. What would you like to know about it?',
        context: { coachingCategory: 'greeting' }
      }
    ]
  };

  if (userId) {
    sessionPayload.createdBy = userId;
  }

  const session = await ChatSession.create(sessionPayload);

  return session;
};

const sendMessage = async (sessionId, content) => {
  const session = await ChatSession.findById(sessionId).populate('review');
  if (!session) throw new Error('Chat session not found');

  session.messages.push({
    role: 'user',
    content
  });

  const aiResponse = generateMockedResponse(content, session.review);

  session.messages.push({
    role: 'assistant',
    content: aiResponse.content,
    context: aiResponse.context
  });

  await session.save();

  return session.messages[session.messages.length - 1];
};

const getSession = async (sessionId) => {
  const session = await ChatSession.findById(sessionId);
  if (!session) throw new Error('Chat session not found');
  return session;
};

const getChatsByUser = async (userId) => {
  return await ChatSession.find({ createdBy: userId })
    .select('review status createdAt updatedAt')
    .sort({ createdAt: -1 })
    .lean();
};

module.exports = {
  createSession,
  sendMessage,
  getSession,
  getChatsByUser
};
