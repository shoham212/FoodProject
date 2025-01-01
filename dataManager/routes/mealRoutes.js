const express = require('express');
const router = express.Router();
const { addMeal, getAllMeals, getMealById, deleteMeal,upload  } = require('../controllers/mealController');
const { authenticateToken } = require('../services/authMiddleware'); // ייבוא ה-Middleware

router.post('/add', upload.single('image'), addMeal);

router.get('/add', (req, res) => {
    res.render('pages/addMeal');
});

router.get('/history', (req, res) => {
    res.render('pages/history');
});

// מסלול לשליפת כל הארוחות (מוגן באמצעות authenticateToken)
router.get('/meals', authenticateToken, getAllMeals);

// מסלול לשליפת ארוחה לפי מזהה (מוגן באמצעות authenticateToken)
router.get('/meals/:id', authenticateToken, getMealById);

// מסלול למחיקת ארוחה לפי מזהה (מוגן באמצעות authenticateToken)
router.delete('/:id', authenticateToken, deleteMeal);

module.exports = router;
