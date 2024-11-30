// routes/mealRoutes.js
const express = require('express');
const { predictSugarLevel } = require('../controllers/mealController');

const router = express.Router();

router.post('/predict', authenticateToken, predictSugarLevel);

module.exports = router;
