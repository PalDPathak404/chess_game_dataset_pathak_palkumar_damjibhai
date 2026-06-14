const Game = require('../models/game.model');
const Review = require('../models/review.model');
const ChatSession = require('../models/chat.model');
const User = require('../models/user.model');

const getUserDashboard = async (userId) => {
  const [profile, totalImports, totalReviews, totalChats, recentImports, recentReviews, recentChats] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Game.countDocuments({ 'importMetadata.importedByUser': userId }),
    Review.countDocuments({ createdBy: userId }),
    ChatSession.countDocuments({ createdBy: userId }),
    Game.find({ 'importMetadata.importedByUser': userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Review.find({ createdBy: userId })
      .populate('match', 'gameId players opening winner victoryStatus turns')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    ChatSession.find({ createdBy: userId })
      .populate({
        path: 'review',
        populate: { path: 'match', select: 'players opening' }
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
  ]);

  // Optionally calculate review completion rate or most common opening here
  let completedReviews = 0;
  if (totalReviews > 0) {
    completedReviews = await Review.countDocuments({ createdBy: userId, status: 'completed' });
  }

  return {
    profile,
    statistics: {
      totalImports,
      totalReviews,
      totalChats,
      reviewCompletionRate: totalReviews ? Math.round((completedReviews / totalReviews) * 100) : 0,
      recentActivityCount: recentImports.length + recentReviews.length + recentChats.length
    },
    recentImports,
    recentReviews,
    recentChats
  };
};

const getUserReviews = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find({ createdBy: userId })
      .populate('match', 'gameId players opening winner victoryStatus turns')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Review.countDocuments({ createdBy: userId })
  ]);

  return { reviews, total, page: parseInt(page), pages: Math.ceil(total / limit) };
};

const getUserImports = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [imports, total] = await Promise.all([
    Game.find({ 'importMetadata.importedByUser': userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Game.countDocuments({ 'importMetadata.importedByUser': userId })
  ]);

  return { imports, total, page: parseInt(page), pages: Math.ceil(total / limit) };
};

const getUserChats = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [chats, total] = await Promise.all([
    ChatSession.find({ createdBy: userId })
      .populate({
        path: 'review',
        populate: { path: 'match', select: 'players opening' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    ChatSession.countDocuments({ createdBy: userId })
  ]);

  return { chats, total, page: parseInt(page), pages: Math.ceil(total / limit) };
};

module.exports = {
  getUserDashboard,
  getUserReviews,
  getUserImports,
  getUserChats
};
