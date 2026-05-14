const express = require('express');
const gameRoutes = require('./game.routes');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Knightly backend is running',
  });
});

router.use('/games', gameRoutes);

module.exports = router;
