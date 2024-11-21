
const dbConfig = {
    user: process.env.DB_USER, // שם המשתמש לבסיס הנתונים
    password: process.env.DB_PASSWORD, // סיסמת בסיס הנתונים
    server: process.env.DB_SERVER, // כתובת השרת (למשל somedb.somee.com)
    database: process.env.DB_NAME, // שם בסיס הנתונים
    options: {
        encrypt: true,              // הגדרות אבטחה, מומלץ להשאיר כך
        trustServerCertificate: true, // הוסיפי את השורה הזו
        enableArithAbort: true
    }
};

// פונקציה לחיבור לבסיס הנתונים
const connectToDatabase = async () => {
    try {
      const pool = await sql.connect(dbConfig);
      console.log('Connected to SQL Server');
      return pool; // מחזירה את החיבור
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error; // זורקת שגיאה אם החיבור נכשל
    }
  };
  
  module.exports = { sql, connectToDatabase };
