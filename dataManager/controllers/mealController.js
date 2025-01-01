const { 
  addMealToDatabase, getAllMealsFromDatabase, getMealByIdFromDatabase, deleteMealFromDatabase, getMealHistoryFromDatabase } = require('../dal/mealDal');
const { getDayType } = require('../services/dayTypeService');
const { processImage } = require('../controllers/imageController'); // פונקציה לשירות הטיפול בתמונה
const multer = require('multer');
const path = require('path');

// הוספת ארוחה
const addMeal = async (req, res) => {
  try {
    const userId = req.user?.id; // שליפת מזהה המשתמש מה-JWT
    const { meal, description, meal_type, date, sugar_level_after_two_hours, telegramData } = req.body;

    if (!userId) throw new Error('User ID is missing.');

    let imagePath = null;

    if (req.file) {
      // קובץ שהועלה ע"י המשתמש
      imagePath = req.file.path;
      console.log(`🔗 קובץ שהועלה: ${imagePath}`);
    } else if (telegramData) {
      // נתונים שהתקבלו מטלגרם
      console.log('🔍 נתונים התקבלו מטלגרם, מוריד ושומר תמונה...');
      imagePath = await saveTelegramImage(telegramData); // שמירת תמונה מטלגרם
      console.log(`✅ התמונה נשמרה בנתיב: ${imagePath}`);
    } else {
      throw new Error('❌ לא הועלתה תמונה ולא התקבלו נתוני טלגרם.');
    }

    // קריאה לפונקציה processImage
    const { imageUrl: finalImageUrl, sugarLevel } = await processImage(userId, imagePath);

    const day_type = await getDayType(date, meal_type);

    await addMealToDatabase(userId,meal,description,meal_type,date,day_type,finalImageUrl,sugarLevel, sugar_level_after_two_hours);

    res.status(201).json({ message: 'הארוחה נוספה בהצלחה!' });
  } catch (error) {
    console.error('❌ שגיאה בהוספת הארוחה:', error.message);
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
    const userId = req.user.id; // משתמש מחובר
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing.' });
    }

    const { startDate, endDate, mealType } = req.query;

    // קריאת נתוני הארוחות מהמסד
    const meals = await getMealHistoryFromDatabase(userId, startDate, endDate, mealType);

    // העברת הנתונים ל-EJS
    res.render('pages/history', { mealsData: meals });
  } catch (error) {
    console.error('Error fetching meal history:', error.message);
    res.status(500).json({ error: 'Failed to fetch meal history.' });
  }
};


// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); //Keep the file in this directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure file extension is added
  }
});

// יצירת משתנה upload עם Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 } // הגבלת גודל קובץ ל-5MB
});


module.exports = {
  addMeal,
  getAllMeals,
  getMealById,
  deleteMeal,
  getMealHistory,
  upload
};
