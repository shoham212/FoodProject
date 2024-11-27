const axios = require('axios');
const { USDA_API_KEY, USDA_BASE_URL } = require('../config/USDAConfig.js');

const getSugarLevel = async (mealType) => {
    try {
        const response = await axios.get(`${USDA_BASE_URL}/foods/search`, {
            params: {
                query: mealType,
                api_key: USDA_API_KEY,
            },
        });

        // מציאת סוג המזון הראשון
        const food = response.data.foods[0];
        if (!food) {
            throw new Error('Food not found for the given meal type.');
        }

        // חיפוש כמות הסוכר
        const sugarNutrient = food.foodNutrients.find(
            (nutrient) => nutrient.nutrientName.toLowerCase().includes('sugar')
        );

        return sugarNutrient ? sugarNutrient.value : 0;
    } catch (err) {
        console.error('Error fetching sugar level:', err.message);
        throw new Error('Failed to fetch sugar level');
    }
};

module.exports = { getSugarLevel };