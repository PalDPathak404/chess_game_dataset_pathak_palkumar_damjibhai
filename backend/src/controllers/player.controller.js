const playerService = require('../services/player.service');

const getPlayers = async (req, res) => {
  try {
    const { data, count, pagination } = await playerService.getAllPlayers(req.query);

    res.status(200).json({
      success: true,
      count,
      pagination,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch players',
      error: error.message
    });
  }
};

const getPlayerDetails = async (req, res) => {
  try {
    const { username } = req.params;
    const player = await playerService.getPlayerDetails(username);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found or has no matches'
      });
    }

    res.status(200).json({
      success: true,
      data: player
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player details',
      error: error.message
    });
  }
};

const getPlayerHistory = async (req, res) => {
  try {
    const { username } = req.params;
    const { data, count, pagination } = await playerService.getPlayerHistory(username, req.query);

    res.status(200).json({
      success: true,
      count,
      pagination,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player history',
      error: error.message
    });
  }
};

const getPlayerStats = async (req, res) => {
  try {
    const { username } = req.params;
    const stats = await playerService.getPlayerStats(username);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Player not found or has no matches'
      });
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player stats',
      error: error.message
    });
  }
};

const getTopRated = async (req, res) => {
  try {
    const data = await playerService.getTopRated(req.query);

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top rated players',
      error: error.message
    });
  }
};

const getTopActive = async (req, res) => {
  try {
    const data = await playerService.getTopActive(req.query);

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top active players',
      error: error.message
    });
  }
};

module.exports = {
  getPlayers,
  getPlayerDetails,
  getPlayerHistory,
  getPlayerStats,
  getTopRated,
  getTopActive
};
