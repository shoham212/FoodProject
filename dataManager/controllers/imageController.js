const { analyzeImage, isImageFood } = require('../services/imageAnalysisService');
const { getImageFromTelegram } = require('../services/botService');
const { getSugarLevel } = require('../services/USDAservice');

const processImage = async (imageUrl, userId) => {
  if (!imageUrl) {
    console.log(`אין תמונה ב-URL, ממתין לתמונה דרך Telegram עבור המשתמש: ${userId}`);
    imageUrl = await getImageFromTelegram(userId); // העברת userId לבוט
  }

  if (!imageUrl) {
    throw new Error(`תמונה לא סופקה ולא התקבלה דרך Telegram עבור המשתמש: ${userId}.`);
  }

  console.log(`URL התמונה שהתקבל עבור המשתמש ${userId}: ${imageUrl}`);

  // ניתוח התמונה
  const tags = await analyzeImage(imageUrl);
  console.log(`תגיות מהתמונה עבור המשתמש ${userId}:`, tags);

  const mainTag = tags[0]?.tag;
  console.log(`תגית ראשונה מ-Imagga עבור המשתמש ${userId}: ${mainTag}`);

  if (!mainTag) {
    throw new Error(`לא זוהתה תגית מהתמונה עבור המשתמש: ${userId}.`);
  }

  // בדיקה אם מדובר במאכל
  const isFood = isImageFood(tags);
  console.log(`האם התמונה מייצגת מאכל עבור המשתמש ${userId}: ${isFood}`);

  if (!isFood) {
    throw new Error(`התמונה אינה מייצגת מאכל עבור המשתמש: ${userId}.`);
  }

  // פנייה ל-USDA לקבלת רמת הסוכר
  const sugarLevel = await getSugarLevel(mainTag);
  console.log(`רמת סוכר לפי USDA עבור המשתמש ${userId}: ${sugarLevel}`);

  return { imageUrl, sugarLevel };
};

module.exports = { processImage };
