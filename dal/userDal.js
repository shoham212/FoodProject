const { sql, connectToDatabase } = require('../config/dbConfig');
const bcrypt = require('bcrypt');

const createUser = async (username, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await connectToDatabase();
    await pool.request()
      .input('Username', sql.NVarChar, username)
      .input('Password', sql.NVarChar, hashedPassword)
      .query('INSERT INTO Users (username, password) VALUES (@Username, @Password)');
  } catch (error) {
    console.error('שגיאה ביצירת המשתמש:', error);
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE username = @Username');
    return result.recordset[0];
  } catch (error) {
    console.error('שגיאה באחזור פרטי משתמש:', error);
    throw error;
  }
};

module.exports = { createUser, getUserByUsername };
