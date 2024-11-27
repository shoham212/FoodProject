const { getSugarLevel } = require('../services/USDAService');

const fetchSugarLevelForMeal = async (mealType) => {
    try {
        return await getSugarLevel(mealType);
    } catch (err) {
        console.error('Error in DAL while fetching sugar level:', err);
        throw err;
    }
};

module.exports = { fetchSugarLevelForMeal };
