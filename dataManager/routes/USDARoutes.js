const express = require('express');
const { getMealSugarLevel } = require('../controllers/USDAController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// נתיב לקבלת רמת סוכר לפי סוג ארוחה
router.post('/sugar-level', authenticateToken, getMealSugarLevel);

module.exports = router;
