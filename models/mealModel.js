const { sql } = require('../config/db');

const getMeals = async () => {
    const result = await sql.query`SELECT * FROM meals`;
    return result.recordset;
};

const addMeal = async (meal, meal_type, description, sugarLevel, date, image_url) => {
    await sql.query`INSERT INTO meals (meal, meal_type, description, sugarLevel, date, image_url) 
                    VALUES (${meal}, ${meal_type}, ${description}, ${sugarLevel}, ${date}, ${image_url})`;
};

module.exports = { getMeals, addMeal };
