const analyticsService = require('../services/analytics.service');

const getVictoryDistribution = async (req, res) => {
  try {
    const data = await analyticsService.getVictoryDistribution();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'No analytics data found'
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch victory distribution',
      error: error.message
    });
  }
};

const getOpeningSuccess = async (req, res) => {
  try {
    const { data, count, pagination } = await analyticsService.getOpeningSuccess(req.query);

    res.status(200).json({
      success: true,
      count,
      pagination,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opening success metrics',
      error: error.message
    });
  }
};

module.exports = {
  getVictoryDistribution,
  getOpeningSuccess
};
