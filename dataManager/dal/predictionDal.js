// dal/mealDal.js
const { getUserMealData } = require('../models/mealModel');

// פונקציה לשליפת נתוני הארוחות של משתמש ספציפי
const fetchMealDataForUser = async (userId) => {
  try {
    const meals = await getUserMealData(userId);

    if (!meals || meals.length === 0) {
      console.error(`No meal data found for user with ID: ${userId}`);
      throw new Error('No meal data found for this user.');
    }

    return meals;
  } catch (error) {
    console.error(`Error fetching meal data for user ID: ${userId}`, error.message);
    throw new Error('Failed to fetch meal data.');
  }
};

module.exports = { fetchMealDataForUser };
