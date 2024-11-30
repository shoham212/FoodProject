const { Telegraf } = require('telegraf');
const telegramConfig = require('../config/telegramConfig'); // ייבוא ההגדרות של Telegram

const bot = new Telegraf(telegramConfig.botToken);

// משתנה לשמירת התמונות לפי מזהה משתמש
const userImages = {};

// מאזין לתמונה שנשלחת
bot.on('photo', async (ctx) => {
  console.log('תמונה התקבלה מהמשתמש...');
  try {
    const userId = ctx.from.id; // מזהה המשתמש ב-Telegram
    const photo = ctx.message.photo.pop(); // לוקח את האיכות הגבוהה ביותר
    console.log('Photo object:', photo);

    const fileId = photo.file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);

    userImages[userId] = fileLink.href; // שומר את ה-URL לפי מזהה משתמש
    console.log(`URL של התמונה שהתקבלה למשתמש ${userId}:`, fileLink.href);

    await ctx.reply('התמונה התקבלה בהצלחה!');
  } catch (error) {
    console.error('שגיאה בטיפול בתמונה:', error.message);
  }
});

// פונקציה לקבלת התמונה לפי מזהה משתמש
const getImageFromTelegram = async (userId) => {
  console.log(`ממתין לתמונה עבור המשתמש ${userId}...`);
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (userImages[userId]) {
        const imageUrl = userImages[userId];
        clearInterval(checkInterval);
        delete userImages[userId]; // מחיקת התמונה לאחר שימוש
        resolve(imageUrl);
      }
    }, 1000); // בדיקה כל שנייה
  });
};

// הפעלת הבוט
const startBot = () => {
  bot.launch();
  console.log('Telegram Bot is running!');
};

module.exports = { startBot, getImageFromTelegram };
