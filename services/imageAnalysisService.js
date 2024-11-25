const axios = require('axios');

// פונקציה לניתוח תמונה באמצעות Imagga API
async function analyzeImage(imageUrl) {
    const apiKey = process.env.IMAGGA_API_KEY;
    const apiSecret = process.env.IMAGGA_API_SECRET;

    try {
        // שליחת בקשה ל-API
        const response = await axios.get('https://api.imagga.com/v2/tags', {
            params: { image_url: imageUrl },
            headers: {
                Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
            }
        });

        // עיבוד תגיות - החזרת רשימה של תגיות
        const tags = response.data.result.tags.map(tag => ({
            tag: tag.tag.en.toLowerCase(),
            confidence: tag.confidence
        }));

        return tags;
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw error;
    }
}

// פונקציה לבדיקה אם התמונה כוללת מאכל
function isImageFood(tags) {
    const foodKeywords = ['food', 'meal', 'dish', 'snack', 'drink'];

    // בדיקה אם אחת התגיות קשורה למאכל
    const isFood = tags.some(tag =>
        foodKeywords.some(keyword => tag.tag.includes(keyword)) && tag.confidence > 50
    );

    return isFood;
}

module.exports = { analyzeImage, isImageFood };
