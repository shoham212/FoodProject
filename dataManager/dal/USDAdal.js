const { getSugarLevel } = require('../services/USDAService');

// פונקציה לשליפת רמת הסוכר עבור סוג מזון
const fetchSugarLevelForMeal = async (mealType) => {
    try {
        if (!mealType) {
            throw new Error('Meal type is required to fetch sugar level.');
        }
        console.log(`Fetching sugar level for meal type: ${mealType}`);
        const sugarLevel = await getSugarLevel(mealType);
        
        if (sugarLevel === undefined || sugarLevel === null) {
            console.warn(`No sugar level data found for meal type: ${mealType}`);
            return 0; // ערך ברירת מחדל אם אין מידע
        }

        return sugarLevel;
    } catch (err) {
        console.error('Error in DAL while fetching sugar level:', err.message);
        throw new Error(`Failed to fetch sugar level for meal type: ${mealType}`);
    }
};

module.exports = { fetchSugarLevelForMeal };
