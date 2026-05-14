const express = require('express');
const matchController = require('../controllers/match.controller');

const router = express.Router();

router.route('/')
  .get(matchController.getMatches);

router.route('/:id')
  .get(matchController.getMatch);

module.exports = router;
