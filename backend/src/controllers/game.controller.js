const gameService = require('../services/game.service');
const mongoose = require('mongoose');

const getGames = async (req, res) => {
  try {
    const { data, count, pagination } = await gameService.getAllGames(req.query);

    res.status(200).json({
      success: true,
      count,
      pagination,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch games',
      error: error.message
    });
  }
};

const getGame = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid game ID format'
      });
    }

    const game = await gameService.getGameById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game',
      error: error.message
    });
  }
};

module.exports = {
  getGames,
  getGame
};
