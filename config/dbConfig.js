
const dbConfig = {
    user: 'shohamshervi_SQLLogin_1',         // שם המשתמש שקיבלת מ-Somee.com
    password: 'ewrrkwucj1',     // הסיסמה שקיבלת מ-Somee.com
    server: '	foodproject.mssql.somee.com', // כתובת השרת של מסד הנתונים מ-Somee.com
    database: 'foodproject', // שם מסד הנתונים
    options: {
        encrypt: true,              // הגדרות אבטחה, מומלץ להשאיר כך
        trustServerCertificate: true, // הוסיפי את השורה הזו
        enableArithAbort: true
    }
};


module.exports = {
    dbConfig
};
 

