const { analyzeImage, isImageFood } = require('../services/imageAnalysisService');
const { getDataByDbUserId } = require('../services/botService');
const { getSugarLevel } = require('../services/USDAservice');

// פונקציה לטיפול בתמונה
const processImage = async (userId, filePath = null, telegramData = null) => {
  try {
    console.log(`🔍 בודק תמונה עבור userId: ${userId}`);

    if (filePath) {
      // קובץ התמונה הועלה ע"י המשתמש
      console.log(`✅ קובץ התמונה נמצא בנתיב: ${filePath}`);
    } else if (telegramData) {
      // שמירת תמונה שמגיעה מטלגרם
      console.log('🔍 נתונים התקבלו מטלגרם, מוריד ושומר תמונה...');
      filePath = await saveTelegramImage(telegramData); // שמירת תמונה מטלגרם
      console.log(`✅ התמונה מטלגרם נשמרה בנתיב: ${filePath}`);
    } else {
      // במקרה שאין תמונה
      throw new Error('❌ לא הועלה קובץ ולא התקבלו נתוני טלגרם.');
    }

    console.log(`🔄 מעבד את התמונה עם נתיב: ${filePath}`);
    const tags = await analyzeImage(filePath); // ניתוח התמונה
    console.log(`🔍 תגיות התמונה: ${JSON.stringify(tags)}`);

    const mainTag = tags[0]?.tag;
    if (!mainTag) throw new Error('❌ התמונה לא מכילה פריט מזוהה.');

    const isFood = isImageFood(tags);
    if (!isFood) throw new Error('❌ התמונה אינה מכילה מאכל.');

    const sugarLevel = await getSugarLevel(mainTag);
    console.log(`✅ רמת סוכר מחושבת: ${sugarLevel}`);

    return { imageUrl: filePath, sugarLevel };
  } catch (error) {
    console.error('❌ שגיאה בעיבוד התמונה:', error.message);
    throw error;
  }
};


module.exports = { processImage };
