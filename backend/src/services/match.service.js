const Game = require('../models/game.model');
const ApiFeatures = require('../utils/apiFeatures');
const mongoose = require('mongoose');

const getAllMatches = async (queryString) => {
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

const getMatchById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const match = await Game.findById(id);
    if (match) return match;
  }
  return await Game.findOne({ gameId: id });
};

module.exports = {
  getAllMatches,
  getMatchById
};
