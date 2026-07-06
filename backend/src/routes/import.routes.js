const express = require('express');
const importController = require('../controllers/import.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/pgn')
  .post(optionalAuth, importController.importPgn);

router.route('/pgn/review')
  .post(optionalAuth, importController.importPgnWithReview);

module.exports = router;
