const { fetchSugarLevelForMeal } = require('../dal/USDADal');
const Meal = require('../models/USDAModel');

const getMealSugarLevel = async (req, res) => {
    try {
        const { mealName } = req.body;

        if (!mealName) {
            return res.status(400).json({ error: 'Meal name is required' });
        }

        const sugarLevel = await fetchSugarLevelForMeal(mealName);

        const meal = new Meal(mealName, sugarLevel);

        res.status(200).json(meal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getMealSugarLevel };
