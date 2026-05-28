const ChatSession = require('../models/chat.model');
const Review = require('../models/review.model');
const { generateMockedResponse } = require('../utils/aiResponse.util');

const createSession = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error('Review not found');

  const session = await ChatSession.create({
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
  });

  return session;
};

const sendMessage = async (sessionId, content) => {
  const session = await ChatSession.findById(sessionId).populate('review');
  if (!session) throw new Error('Chat session not found');

  // Add user message
  session.messages.push({
    role: 'user',
    content
  });

  // Generate mocked AI response with context
  // In the future, this is where we assemble the prompt, including session history,
  // review data, and send it to the OpenAI API.
  const aiResponse = generateMockedResponse(content, session.review);

  // Add assistant message
  session.messages.push({
    role: 'assistant',
    content: aiResponse.content,
    context: aiResponse.context
  });

  await session.save();

  // Return the newly added assistant message
  return session.messages[session.messages.length - 1];
};

const getSession = async (sessionId) => {
  const session = await ChatSession.findById(sessionId);
  if (!session) throw new Error('Chat session not found');
  return session;
};

module.exports = {
  createSession,
  sendMessage,
  getSession
};
