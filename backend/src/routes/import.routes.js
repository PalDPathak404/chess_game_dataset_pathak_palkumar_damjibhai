const express = require('express');
const importController = require('../controllers/import.controller');
const { optionalProtect } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/pgn')
  .post(optionalProtect, importController.importPgn);

router.route('/pgn/review')
  .post(optionalProtect, importController.importPgnWithReview);

module.exports = router;
