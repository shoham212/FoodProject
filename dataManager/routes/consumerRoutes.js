const express = require('express');
const router = express.Router();
const { startConsumer } = require('../controllers/consumerController');

// מסלול להתחלת ה-Consumer
router.get('/start', startConsumer);

module.exports = router;
