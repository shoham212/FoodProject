const { sql, connectToDatabase } = require('../config/dbConfig');

// פונקציה להוספת ארוחה למסד הנתונים
const addMealToDatabase = async (meal, mealType, description, sugarLevel, date, imageUrl, dayType) => {
  try {
    const pool = await connectToDatabase();
    await pool.request()
      .input('meal', sql.NVarChar, meal)
      .input('meal_type', sql.NVarChar, mealType)
      .input('description', sql.NVarChar, description)
      .input('sugarLevel', sql.Int, sugarLevel)
      .input('date', sql.Date, date)
      .input('image_url', sql.NVarChar, imageUrl)
      .input('day_type', sql.NVarChar, dayType)
      .query(`
        INSERT INTO Meals (meal, meal_type, description, sugarLevel, date, image_url, day_type)
        VALUES (@meal, @meal_type, @description, @sugarLevel, @date, @image_url, @day_type)
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
