const { sql, connectToDatabase } = require('../config/dbConfig');
const bcrypt = require('bcrypt');

// פונקציה ליצירת משתמש חדש
const createUser = async (username, password) => {
  try {
    if (!username || !password) {
      throw new Error('Username and password are required.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await connectToDatabase();

    await pool.request()
      .input('Username', sql.NVarChar, username)
      .input('Password', sql.NVarChar, hashedPassword)
      .query('INSERT INTO Users (username, password) VALUES (@Username, @Password)');

    console.log(`User ${username} created successfully.`);
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw new Error('Failed to create user. Please try again.');
  }
};

// פונקציה לשליפת משתמש לפי שם משתמש
const getUserByUsername = async (username) => {
  try {
    if (!username) {
      throw new Error('Username is required to fetch user details.');
    }

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE username = @Username');

    const user = result.recordset[0];
    if (!user) {
      console.warn(`User with username ${username} not found.`);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    throw new Error('Failed to fetch user details. Please try again.');
  }
};

module.exports = { createUser, getUserByUsername };
