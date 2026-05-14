const Game = require('../models/game.model');
const ApiFeatures = require('../utils/apiFeatures');

const getAllGames = async (queryString) => {
  const features = new ApiFeatures(Game.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const data = await features.query;
  
  const countFeatures = new ApiFeatures(Game.find(), queryString).filter();
  const count = await countFeatures.query.countDocuments();

  return {
    data,
    count,
    pagination: features.paginationParams
  };
};

const getGameById = async (id) => {
  return await Game.findById(id);
};

module.exports = {
  getAllGames,
  getGameById
};
