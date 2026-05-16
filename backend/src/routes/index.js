const express = require('express');
const matchRoutes = require('./match.routes');
const playerRoutes = require('./player.routes');
const analyticsRoutes = require('./analytics.routes');
const searchRoutes = require('./search.routes');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Knightly backend is running',
  });
});

router.use('/matches', matchRoutes);
router.use('/players', playerRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/search', searchRoutes);

module.exports = router;
