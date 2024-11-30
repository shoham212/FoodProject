const { 
  addMealToDatabase, 
  getAllMealsFromDatabase, 
  getMealByIdFromDatabase, 
  deleteMealFromDatabase, 
  getMealHistoryFromDatabase 
} = require('../dal/mealDal');
const { getDayType } = require('../services/dayTypeService');
const { processImage } = require('../controllers/imageController'); // פונקציה לשירות הטיפול בתמונה

// הוספת ארוחה
const addMeal = async (req, res) => {
  try {
    const userId = req.user.id; // קבלת ה-userId מתוך האסימון
    const { meal, description, meal_type, date, sugar_level_after_two_hours, image_url } = req.body;

    // טיפול בתמונה באמצעות imageController
    const { imageUrl, sugarLevel } = await processImage(image_url);

    // קבלת סוג היום
    const day_type = await getDayType(date, meal_type);

    // הוספת הארוחה למסד הנתונים
    await addMealToDatabase(userId, meal, description, meal_type, date, day_type, imageUrl, sugarLevel, sugar_level_after_two_hours);
    res.status(201).json({ message: 'הארוחה נוספה בהצלחה.' });
  } catch (error) {
    console.error('שגיאה בהוספת הארוחה:', error);
    res.status(500).json({ message: 'שגיאה בהוספת הארוחה.', error: error.message });
  }
};

// שליפת כל הארוחות של המשתמש
const getAllMeals = async (req, res) => {
  try {
    const userId = req.user.id; // קבלת ה-userId מתוך האסימון
    const meals = await getAllMealsFromDatabase(userId);
    res.status(200).json(meals);
  } catch (error) {
    console.error('שגיאה בשליפת הארוחות:', error);
    res.status(500).json({ error: 'שגיאה בשליפת הארוחות' });
  }
};

// שליפת ארוחה לפי מזהה
const getMealById = async (req, res) => {
  try {
    const userId = req.user.id; // קבלת ה-userId מתוך האסימון
    const { id } = req.params;
    const meal = await getMealByIdFromDatabase(userId, id);

    if (!meal) {
      return res.status(404).json({ error: 'ארוחה לא נמצאה' });
    }

    res.status(200).json(meal);
  } catch (error) {
    console.error('שגיאה בשליפת הארוחה:', error);
    res.status(500).json({ error: 'שגיאה בשליפת הארוחה' });
  }
};

// מחיקת ארוחה לפי מזהה
const deleteMeal = async (req, res) => {
  try {
    const userId = req.user.id; // קבלת ה-userId מתוך האסימון
    const mealId = req.params.id; // קבלת ה-ID מהכתובת
    await deleteMealFromDatabase(userId, mealId); // קריאה לפונקציה שמוחקת מה-DAL
    res.status(200).json({ message: 'הארוחה נמחקה בהצלחה' });
  } catch (error) {
    console.error('שגיאה במחיקת הארוחה:', error);
    res.status(500).json({ error: 'שגיאה במחיקת הארוחה' });
  }
};

// קבלת היסטוריית ארוחות
const getMealHistory = async (req, res) => {
  try {
    const userId = req.user.id; // קבלת ה-userId מתוך האסימון
    const { startDate, endDate, mealType } = req.query;

    // קריאה לפונקציה שמבצעת שאילתה
    const meals = await getMealHistoryFromDatabase(userId, startDate, endDate, mealType);

    res.status(200).json(meals);
  } catch (error) {
    console.error('שגיאה בקבלת היסטוריית ארוחות:', error.message);
    res.status(500).json({ error: 'שגיאה בקבלת היסטוריית ארוחות' });
  }
};

module.exports = {
  addMeal,
  getAllMeals,
  getMealById,
  deleteMeal,
  getMealHistory
};
