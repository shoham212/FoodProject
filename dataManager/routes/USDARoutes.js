const express = require('express');
const { getMealSugarLevel } = require('../controllers/USDAController');

const router = express.Router();

router.post('/sugar-level', getMealSugarLevel);

module.exports = router;
