const { fetchSugarLevelForMeal } = require('../dal/USDADal');
const Meal = require('../models/USDAModel');

const getMealSugarLevel = async (req, res) => {
    try {
        // שליפת userId מהאסימון
        const userId = req.user.id; // נדרש Middleware לאימות

        const { mealName } = req.body;

        if (!mealName) {
            return res.status(400).json({ error: 'Meal name is required' });
        }

        // שליפת רמת הסוכר מה-DAL
        const sugarLevel = await fetchSugarLevelForMeal(mealName);

        if (!sugarLevel) {
            return res.status(404).json({ error: 'No sugar level data found for the specified meal' });
        }

        // יצירת אובייקט ארוחה
        const meal = new Meal(mealName, sugarLevel);

        res.status(200).json(meal);
    } catch (err) {
        console.error('Error fetching meal sugar level:', err.message);
        res.status(500).json({ error: 'Failed to fetch sugar level.', details: err.message });
    }
};

module.exports = { getMealSugarLevel };
