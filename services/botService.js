const { Telegraf } = require('telegraf');
const telegramConfig = require('../config/telegramConfig'); // ייבוא ההגדרות של Telegram

const bot = new Telegraf(telegramConfig.botToken);

let imageUrlFromTelegram = null;

// מאזין לתמונה שנשלחת
bot.on('photo', async (ctx) => {
  console.log('תמונה התקבלה מהמשתמש...');
  try {
    const photo = ctx.message.photo.pop(); // לוקח את האיכות הגבוהה ביותר
    console.log('Photo object:', photo);

    const fileId = photo.file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);

    imageUrlFromTelegram = fileLink.href; // שומר את ה-URL
    console.log('URL של התמונה שהתקבלה:', imageUrlFromTelegram); // הדפס את ה-URL

    await ctx.reply('התמונה התקבלה בהצלחה!');
  } catch (error) {
    console.error('שגיאה בטיפול בתמונה:', error.message);
  }
});

// הפונקציה שתאפשר לקונטרולר לקבל את ה-URL
const getImageFromTelegram = async () => {
  console.log("ממתין לתמונה...");
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (imageUrlFromTelegram) {
        clearInterval(checkInterval);
        resolve(imageUrlFromTelegram);
        imageUrlFromTelegram = null; // איפוס לאחר שימוש
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
