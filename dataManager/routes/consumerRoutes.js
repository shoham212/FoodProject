const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware'); // Middleware לאימות
const { startConsumer } = require('../controllers/consumerController');

// מסלול להתחלת ה-Consumer (דורש אימות)
router.get('/start', authenticateToken, startConsumer);

module.exports = router;
