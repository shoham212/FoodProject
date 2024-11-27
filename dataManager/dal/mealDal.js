const { sql, connectToDatabase } = require('../config/dbConfig');

// פונקציה להוספת ארוחה למסד הנתונים
const addMealToDatabase = async (meal,description, meal_type ,date, dayType,	imageUrl,sugar_level, sugar_level_after_two_hours) => {
  try {
    const pool = await connectToDatabase();
    await pool.request()
      .input('meal', sql.NVarChar, meal)
      .input('description', sql.NVarChar, description)
      .input('meal_type', sql.NVarChar, meal_type)
      .input('date', sql.Date, date)
      .input('day_type', sql.NVarChar, dayType)
      .input('image_url', sql.NVarChar, imageUrl)
      .input('sugar_level', sql.Float, 	sugar_level) // שינוי שם העמודה ל-sugar_level
      .input('sugar_level_after_two_hours', sql.Float, sugar_level_after_two_hours) // עמודה חדשה
      .query(`
        INSERT INTO Meals (meal,description, 	meal_type, date, day_type,	image_url, 	sugar_level, sugar_level_after_two_hours)
        VALUES (@meal, @description, @meal_type, @date, @day_type, @image_url, @sugar_level, @sugar_level_after_two_hours)
      `);
    console.log('הארוחה נוספה למסד הנתונים');
  } catch (error) {
    console.error('שגיאה בהוספת ארוחה למסד הנתונים:', error.message);
    throw error;
  }
};


// פונקציה לשליפת כל הארוחות
const getAllMealsFromDatabase = async () => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query('SELECT * FROM Meals');
    return result.recordset;
  } catch (error) {
    console.error('שגיאה בשליפת הארוחות מהמסד:', error);
    throw error;
  }
};

// פונקציה לשליפת ארוחה לפי מזהה
const getMealByIdFromDatabase = async (id) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query('SELECT * FROM Meals WHERE id = @Id');
    return result.recordset[0];
  } catch (error) {
    console.error('שגיאה בשליפת ארוחה מהמסד:', error);
    throw error;
  }
};

const deleteMealFromDatabase = async (mealId) => {
  console.log(`Attempting to delete meal with ID: ${mealId}`);
  const pool = await connectToDatabase();
  await pool.request()
    .input('MealId', sql.Int, mealId)
    .query('DELETE FROM Meals WHERE id = @MealId');
  console.log(`Meal with ID: ${mealId} deleted successfully`);
};

const getMealHistoryFromDatabase = async (startDate, endDate, mealType) => {
  try {
    const pool = await connectToDatabase();
    let query = `SELECT * FROM Meals WHERE 1=1`; // שאילתה דינאמית

    if (startDate && endDate) {
      query += ` AND date BETWEEN @startDate AND @endDate`;
    }
    if (mealType) {
      query += ` AND meal_type = @mealType`;
    }

    const result = await pool.request()
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


module.exports = { addMealToDatabase , getAllMealsFromDatabase, getMealByIdFromDatabase,deleteMealFromDatabase,getMealHistoryFromDatabase };
