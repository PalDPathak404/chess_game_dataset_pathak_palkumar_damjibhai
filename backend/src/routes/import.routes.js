const express = require('express');
const importController = require('../controllers/import.controller');

const router = express.Router();

router.route('/pgn')
  .post(importController.importPgn);

router.route('/pgn/review')
  .post(importController.importPgnWithReview);

module.exports = router;
