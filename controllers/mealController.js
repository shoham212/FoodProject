const { getMeals, addMeal, updateMeal, deleteMeal } = require('../models/mealModel');

const getAllMeals = async (req, res) => {
    try {
        const meals = await getMeals();
        res.json(meals);
    } catch (error) {
        console.error('שגיאה בשליפת הארוחות:', error);
        res.status(500).send('שגיאה בשליפת הארוחות');
    }
};

const createMeal = async (req, res) => {
    const { meal, meal_type, description, sugarLevel, date, image_url } = req.body;

    try {
        await addMeal(meal, meal_type, description, sugarLevel, date, image_url);
        res.send('הארוחה נשמרה בהצלחה!');
    } catch (error) {
        console.error('שגיאה בשמירת הארוחה:', error);
        res.status(500).send('שגיאה בשמירת הארוחה');
    }
};

module.exports = { getAllMeals, createMeal };
