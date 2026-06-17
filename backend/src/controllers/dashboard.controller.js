const dashboardService = require('../services/dashboard.service');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await dashboardService.getUserDashboard(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load dashboard', error: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page, limit } = req.query;
    const data = await dashboardService.getUserReviews(userId, page, limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load user reviews', error: error.message });
  }
};

const getImports = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page, limit } = req.query;
    const data = await dashboardService.getUserImports(userId, page, limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load user imports', error: error.message });
  }
};

const getChats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page, limit } = req.query;
    const data = await dashboardService.getUserChats(userId, page, limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load user chats', error: error.message });
  }
};

module.exports = {
  getDashboard,
  getReviews,
  getImports,
  getChats
};
