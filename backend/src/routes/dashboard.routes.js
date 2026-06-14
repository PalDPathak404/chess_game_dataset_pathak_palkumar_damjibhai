const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All dashboard routes are protected
router.use(protect);

router.get('/', dashboardController.getDashboard);
router.get('/reviews', dashboardController.getReviews);
router.get('/imports', dashboardController.getImports);
router.get('/chats', dashboardController.getChats);

module.exports = router;
