const matchService = require('../services/match.service');

const getMatches = async (req, res) => {
  try {
    const { data, count, pagination } = await matchService.getAllMatches(req.query);

    res.status(200).json({
      success: true,
      count,
      pagination,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch matches',
      error: error.message
    });
  }
};

const getMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await matchService.getMatchById(id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch match',
      error: error.message
    });
  }
};

module.exports = {
  getMatches,
  getMatch
};
