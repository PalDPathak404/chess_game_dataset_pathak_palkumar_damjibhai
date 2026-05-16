const importService = require('../services/import.service');

const importPgn = async (req, res) => {
  try {
    const { pgn } = req.body;

    if (!pgn || typeof pgn !== 'string' || pgn.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'PGN text is required'
      });
    }

    const match = await importService.importPgn(pgn);

    if (!match) {
      return res.status(422).json({
        success: false,
        message: 'Failed to parse PGN — invalid or empty move data'
      });
    }

    res.status(201).json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to import PGN',
      error: error.message
    });
  }
};

const importPgnWithReview = async (req, res) => {
  try {
    const { pgn } = req.body;

    if (!pgn || typeof pgn !== 'string' || pgn.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'PGN text is required'
      });
    }

    const result = await importService.importPgnWithReview(pgn);

    if (!result) {
      return res.status(422).json({
        success: false,
        message: 'Failed to parse PGN — invalid or empty move data'
      });
    }

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to import and review PGN',
      error: error.message
    });
  }
};

module.exports = {
  importPgn,
  importPgnWithReview
};
