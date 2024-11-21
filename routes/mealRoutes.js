const express = require('express');
const { getAllMeals, createMeal } = require('../controllers/mealController');

const router = express.Router();

router.get('/', getAllMeals);
router.post('/', createMeal);

module.exports = router;
