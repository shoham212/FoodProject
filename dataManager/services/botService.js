const { Telegraf } = require('telegraf');
const sql = require('mssql');
const telegramConfig = require('../config/telegramConfig');
const { connectToDatabase } = require('../config/dbConfig');

const bot = new Telegraf(telegramConfig.botToken);

// אובייקט זמני לשמירת התמונות עד לקבלת שם המשתמש
const pendingImages = {};

// מאזין לתמונה שנשלחת
bot.on('photo', async (ctx) => {
  console.log('📸 תמונה התקבלה...');
  try {
    const photo = ctx.message.photo.pop(); // תמונה באיכות גבוהה
    const fileId = photo.file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);

    // שמירת התמונה זמנית עד לקבלת שם המשתמש
    const chatId = ctx.chat.id;
    pendingImages[chatId] = { imageUrl: fileLink.href };
    console.log(`✅ התמונה נשמרה זמנית עבור chatId: ${chatId}`);
    console.log(`🔗 URL לתמונה: ${fileLink.href}`);

    await ctx.reply('תמונה התקבלה בהצלחה! אנא שלח את שם המשתמש שלך.');
  } catch (error) {
    console.error('❌ שגיאה בטיפול בתמונה:', error.message);
    await ctx.reply('שגיאה בטיפול בתמונה. אנא נסה שוב.');
  }
});

// מאזין לטקסט לאחר קבלת התמונה
bot.on('text', async (ctx) => {
  const chatId = ctx.chat.id;
  const username = ctx.message.text;

  console.log(`📩 שם המשתמש שהתקבל: ${username}`);

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('username', sql.VarChar(255), username)
      .query(`SELECT id FROM users WHERE username = @username`);

    if (result.recordset.length === 0) {
      await ctx.reply('❌ שם המשתמש לא נמצא במערכת. אנא נסה שוב.');
      return;
    }

    const dbUserId = result.recordset[0].id;

    if (!pendingImages[chatId]) {
      await ctx.reply('❌ לא התקבלה תמונה. אנא שלח תמונה תחילה.');
      return;
    }

    const imageUrl = pendingImages[chatId].imageUrl;

    // שמירה או עדכון של התמונה לטבלת temporary_sessions
    await pool.request()
      .input('db_user_id', sql.Int, dbUserId)
      .input('image_url', sql.Text, imageUrl)
      .query(`
        IF EXISTS (SELECT 1 FROM temporary_sessions WHERE db_user_id = @db_user_id)
            UPDATE temporary_sessions
            SET image_url = @image_url
            WHERE db_user_id = @db_user_id;
        ELSE
            INSERT INTO temporary_sessions (db_user_id, image_url)
            VALUES (@db_user_id, @image_url);
      `);

    console.log(`✅ התמונה נשמרה או עודכנה ב-DB עבור משתמש ID: ${dbUserId}`);
    await ctx.reply('✅ התמונה נשמרה בהצלחה.');

    delete pendingImages[chatId];
  } catch (error) {
    console.error('❌ שגיאה בשמירת התמונה ב-DB:', error.message);
    await ctx.reply('❌ שגיאה בשמירת הנתונים. אנא נסה שוב מאוחר יותר.');
  }
});

// פונקציה לשליפת תמונה מה-DB לפי userId
const getDataByDbUserId = async (dbUserId) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('db_user_id', sql.Int, dbUserId)
      .query(`SELECT image_url FROM temporary_sessions WHERE db_user_id = @db_user_id`);

    if (result.recordset.length === 0) {
      return null;
    }
    return { imageUrl: result.recordset[0].image_url };
  } catch (error) {
    console.error('❌ שגיאה בשליפת תמונה מה-DB:', error.message);
    throw error;
  }
};

// הפעלת הבוט
const startBot = () => {
  bot.launch();
  console.log('🚀 Telegram Bot is running!');
};

module.exports = { startBot, getDataByDbUserId };
