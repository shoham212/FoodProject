const axios = require('axios');
const imaggaConfig = require('../config/imaggaConfig'); // ייבוא ההגדרות של Imagga

// פונקציה לניתוח תמונה באמצעות Imagga API
async function analyzeImage(imageUrl) {
    try {
        // שליחת בקשה ל-API
        const response = await axios.get(`${imaggaConfig.baseUrl}/tags`, {
            params: { image_url: imageUrl },
            headers: {
                Authorization: `Basic ${Buffer.from(`${imaggaConfig.apiKey}:${imaggaConfig.apiSecret}`).toString('base64')}`
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
