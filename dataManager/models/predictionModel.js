const connectToDatabase = require('../config/dbConfig');
const sql = require('mssql');

const getUserMealData = async (req) => {
  try {
    const userId = req.user.id; // קבלת userId מהאסימון (authMiddleware מוסיף את זה ל-req.user)
    const pool = await connectToDatabase();

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT day_type, meal_type, sugar_level 
        FROM Meals 
        WHERE user_id = @userId
      `);

    return result.recordset;
  } catch (error) {
    console.error('Error fetching meal data for user:', error.message);
    throw new Error('Failed to fetch meal data for user.');
  }
};

module.exports = { getUserMealData };
