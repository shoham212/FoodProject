const express = require('express');
const router = express.Router();
const { addMeal, getAllMeals, getMealById, deleteMeal, getMealHistory } = require('../controllers/mealController');
const { authenticateToken } = require('../middlewares/authMiddleware'); // ייבוא ה-Middleware

// מסלול להוספת ארוחה (מוגן באמצעות authenticateToken)
router.post('/add', authenticateToken, addMeal);

// מסלול לשליפת כל הארוחות (מוגן באמצעות authenticateToken)
router.get('/meals', authenticateToken, getAllMeals);

// מסלול לשליפת ארוחה לפי מזהה (מוגן באמצעות authenticateToken)
router.get('/meals/:id', authenticateToken, getMealById);

// מסלול למחיקת ארוחה לפי מזהה (מוגן באמצעות authenticateToken)
router.delete('/:id', authenticateToken, deleteMeal);

// מסלול לשליפת היסטוריית ארוחות (מוגן באמצעות authenticateToken)
router.get('/history', authenticateToken, getMealHistory);

module.exports = router;
