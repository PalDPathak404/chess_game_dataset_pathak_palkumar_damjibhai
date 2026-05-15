const express = require('express');
const analyticsController = require('../controllers/analytics.controller');

const router = express.Router();

router.route('/victory-distribution')
  .get(analyticsController.getVictoryDistribution);

router.route('/opening-success')
  .get(analyticsController.getOpeningSuccess);

module.exports = router;
