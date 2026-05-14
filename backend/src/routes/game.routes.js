const express = require('express');
const gameController = require('../controllers/game.controller');

const router = express.Router();

router.route('/')
  .get(gameController.getGames);

router.route('/:id')
  .get(gameController.getGame);

module.exports = router;
