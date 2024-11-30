const { sql, connectToDatabase } = require('../config/dbConfig');

// פונקציה להוספת ארוחה למסד הנתונים
const addMealToDatabase = async (userId, meal, description, meal_type, date, dayType, imageUrl, sugar_level, sugar_level_after_two_hours) => {
  try {
    const pool = await connectToDatabase();
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('meal', sql.NVarChar, meal)
      .input('description', sql.NVarChar, description)
      .input('meal_type', sql.NVarChar, meal_type)
      .input('date', sql.Date, date)
      .input('day_type', sql.NVarChar, dayType)
      .input('image_url', sql.NVarChar, imageUrl)
      .input('sugar_level', sql.Float, sugar_level)
      .input('sugar_level_after_two_hours', sql.Float, sugar_level_after_two_hours)
      .query(`
        INSERT INTO Meals (user_id, meal, description, meal_type, date, day_type, image_url, sugar_level, sugar_level_after_two_hours)
        VALUES (@userId, @meal, @description, @meal_type, @date, @day_type, @image_url, @sugar_level, @sugar_level_after_two_hours)
      `);
    console.log('הארוחה נוספה למסד הנתונים');
  } catch (error) {
    console.error('שגיאה בהוספת ארוחה למסד הנתונים:', error.message);
    throw error;
  }
};

// פונקציה לשליפת כל הארוחות של משתמש מסוים
const getAllMealsFromDatabase = async (userId) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Meals WHERE user_id = @userId');
    return result.recordset;
  } catch (error) {
    console.error('שגיאה בשליפת הארוחות מהמסד:', error);
    throw error;
  }
};

// פונקציה לשליפת ארוחה לפי מזהה
const getMealByIdFromDatabase = async (userId, id) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('Id', sql.Int, id)
      .query('SELECT * FROM Meals WHERE id = @Id AND user_id = @userId');
    return result.recordset[0];
  } catch (error) {
    console.error('שגיאה בשליפת ארוחה מהמסד:', error);
    throw error;
  }
};

// פונקציה למחיקת ארוחה לפי מזהה
const deleteMealFromDatabase = async (userId, mealId) => {
  try {
    const pool = await connectToDatabase();
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('MealId', sql.Int, mealId)
      .query('DELETE FROM Meals WHERE id = @MealId AND user_id = @userId');
    console.log(`Meal with ID: ${mealId} deleted successfully`);
  } catch (error) {
    console.error('שגיאה במחיקת הארוחה:', error.message);
    throw error;
  }
};

// פונקציה לשליפת היסטוריית ארוחות
const getMealHistoryFromDatabase = async (userId, startDate, endDate, mealType) => {
  try {
    const pool = await connectToDatabase();
    let query = `SELECT * FROM Meals WHERE user_id = @userId`; // שאילתה דינאמית

    if (startDate && endDate) {
      query += ` AND date BETWEEN @startDate AND @endDate`;
    }
    if (mealType) {
      query += ` AND meal_type = @mealType`;
    }

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('startDate', sql.Date, startDate || null)
      .input('endDate', sql.Date, endDate || null)
      .input('mealType', sql.NVarChar, mealType || null)
      .query(query);

    return result.recordset;
  } catch (error) {
    console.error('שגיאה בביצוע השאילתה:', error.message);
    throw error;
  }
};

module.exports = { 
  addMealToDatabase, 
  getAllMealsFromDatabase, 
  getMealByIdFromDatabase, 
  deleteMealFromDatabase, 
  getMealHistoryFromDatabase 
};
