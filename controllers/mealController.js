const {addMealToDatabase , getAllMealsFromDatabase, getMealByIdFromDatabase, deleteMealFromDatabase,getMealHistoryFromDatabase  } = require('../dal/mealDal');
const { getDayType } = require('../services/dayTypeService'); 
const { getImageFromTelegram } = require('../services/botService');
const { analyzeImage, isImageFood } = require('../services/imageAnalysisService');

const addMeal = async (req, res) => {
  try {
    const { meal, meal_type, description, sugarLevel, date, image_url } = req.body;

    // בדיקה אם תמונה סופקה
    let imageUrl = image_url;

    if (!imageUrl) {
      console.log("אין תמונה ב-URL, ממתין לתמונה דרך Telegram...");
      imageUrl = await getImageFromTelegram(); // פונקציה מ-botService.js
    }

    if (!imageUrl) {
      console.log("לא התקבלה תמונה דרך Telegram.");
      return res.status(400).json({ message: 'תמונה לא סופקה ולא התקבלה דרך Telegram.' });
    }

    console.log(`URL התמונה שהתקבל: ${imageUrl}`);

    // קבלת סוג היום
    const day_type = await getDayType(date, meal_type);
    console.log(`סוג היום: ${day_type}`);

    // ניתוח התמונה באמצעות Imagga
    const tags = await analyzeImage(imageUrl);
    console.log('תגיות מהתמונה:', tags);

    const isFood = isImageFood(tags);
    console.log(`האם התמונה מייצגת מאכל: ${isFood}`);

    if (!isFood) {
      return res.status(400).json({ message: 'התמונה אינה מייצגת מאכל.' });
    }

    // הוספת הארוחה למסד הנתונים
    await addMealToDatabase(meal, meal_type, description, sugarLevel, date, imageUrl, day_type);
    res.status(201).json({ message: 'הארוחה נוספה בהצלחה.' });
  } catch (error) {
    console.error('שגיאה בהוספת הארוחה:', error); // שגיאה מלאה
    res.status(500).json({ message: 'שגיאה בהוספת הארוחה.', error: error.message });
  }
};


// פונקציה לשליפת כל הארוחות
const getAllMeals = async (req, res) => {
  try {
    const meals = await getAllMealsFromDatabase();
    res.status(200).json(meals);
  } catch (error) {
    console.error('שגיאה בשליפת הארוחות:', error);
    res.status(500).json({ error: 'שגיאה בשליפת הארוחות' });
  }
};

// פונקציה לשליפת ארוחה לפי מזהה
const getMealById = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await getMealByIdFromDatabase(id);

    if (!meal) {
      return res.status(404).json({ error: 'ארוחה לא נמצאה' });
    }

    res.status(200).json(meal);
  } catch (error) {
    console.error('שגיאה בשליפת הארוחה:', error);
    res.status(500).json({ error: 'שגיאה בשליפת הארוחה' });
  }
};

//פונקציה למחקת ארוחה לפי מזהה
const deleteMeal = async (req, res) => {
  try {
    const mealId = req.params.id; // קבלת ה-ID מהכתובת
    await deleteMealFromDatabase(mealId); // קריאה לפונקציה שמוחקת מה-DAL
    res.status(200).json({ message: 'הארוחה נמחקה בהצלחה' });
  } catch (error) {
    console.error('שגיאה במחיקת הארוחה:', error);
    res.status(500).json({ error: 'שגיאה במחיקת הארוחה' });
  }
};

const getMealHistory = async (req, res) => {
  try {
    const { startDate, endDate, mealType } = req.query;

    // קריאה לפונקציה שמבצעת שאילתה
    const meals = await getMealHistoryFromDatabase(startDate, endDate, mealType);

    res.status(200).json(meals);
  } catch (error) {
    console.error('שגיאה בקבלת היסטוריית ארוחות:', error.message);
    res.status(500).json({ error: 'שגיאה בקבלת היסטוריית ארוחות' });
  }
};

module.exports = {addMeal , getAllMeals, getMealById, deleteMeal,getMealHistory };
