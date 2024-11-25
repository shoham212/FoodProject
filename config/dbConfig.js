require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER, // שם המשתמש ממוגדר ב-.env
  password: process.env.DB_PASSWORD, // הסיסמה ממוגדרת ב-.env
  server: process.env.DB_SERVER, // כתובת השרת ממוגדרת ב-.env
  database: process.env.DB_NAME, // שם מסד הנתונים ממוגדר ב-.env
  options: {
    encrypt: true, // אם השרת דורש הצפנה
    trustServerCertificate: true // במקרה של אישור עצמי
  }
};

const connectToDatabase = async () => {
  try {
    console.log('Attempting to connect to database...');
    const pool = await sql.connect(dbConfig);
    console.log('Connected to SQL Server');
    return pool;
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    throw error;
  }
};

module.exports = { sql, connectToDatabase };
