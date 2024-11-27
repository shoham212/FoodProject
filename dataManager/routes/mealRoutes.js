const express = require('express');
const router = express.Router();
const { addMeal, getAllMeals, getMealById, deleteMeal,getMealHistory  } = require('../controllers/mealController');

// מסלול להוספת ארוחה
router.post('/add', addMeal);

// מסלול לשליפת כל הארוחות
router.get('/meals', getAllMeals);

// מסלול לשליפת ארוחה לפי מזהה
router.get('/meals/:id', getMealById);

// מסלול למחיקת ארוחה לפי מזהה
router.delete('/:id', deleteMeal);

// ב- mealRoutes.js
router.get('/history', getMealHistory);

  
module.exports = router;
