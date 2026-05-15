const express = require('express');
const playerController = require('../controllers/player.controller');

const router = express.Router();

router.route('/top-rated')
  .get(playerController.getTopRated);

router.route('/top-active')
  .get(playerController.getTopActive);

router.route('/')
  .get(playerController.getPlayers);

router.route('/:username')
  .get(playerController.getPlayerDetails);

router.route('/:username/history')
  .get(playerController.getPlayerHistory);

router.route('/:username/stats')
  .get(playerController.getPlayerStats);

module.exports = router;
