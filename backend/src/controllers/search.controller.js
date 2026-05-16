const searchService = require('../services/search.service');

const searchOpenings = async (req, res) => {
  try {
    const { data, count, pagination } = await searchService.searchOpenings(req.query);

    res.status(200).json({
      success: true,
      count,
      pagination,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search openings',
      error: error.message
    });
  }
};

const searchPlayers = async (req, res) => {
  try {
    const { data, count, pagination } = await searchService.searchPlayers(req.query);

    res.status(200).json({
      success: true,
      count,
      pagination,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search players',
      error: error.message
    });
  }
};

const searchEco = async (req, res) => {
  try {
    const { data, count, pagination } = await searchService.searchEco(req.query);

    res.status(200).json({
      success: true,
      count,
      pagination,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search ECO codes',
      error: error.message
    });
  }
};

const getAutocomplete = async (req, res) => {
  try {
    const data = await searchService.getAutocomplete(req.query);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch autocomplete suggestions',
      error: error.message
    });
  }
};

const searchFuzzy = async (req, res) => {
  try {
    const { data, count, pagination } = await searchService.searchFuzzy(req.query);

    res.status(200).json({
      success: true,
      count,
      pagination,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to perform fuzzy search',
      error: error.message
    });
  }
};

module.exports = {
  searchOpenings,
  searchPlayers,
  searchEco,
  getAutocomplete,
  searchFuzzy
};
