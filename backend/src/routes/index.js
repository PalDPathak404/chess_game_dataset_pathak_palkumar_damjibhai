const express = require('express');
const matchRoutes = require('./match.routes');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Knightly backend is running',
  });
});

router.use('/matches', matchRoutes);

module.exports = router;
