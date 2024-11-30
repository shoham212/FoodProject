const { fetchMealDataForUser } = require('../dal/mealDal');
const mlcart = require('mlcart');

const predictSugarLevel = async (req, res) => {
  try {
    // הוצאת userId מהאסימון
    const userId = req.user.id; // userId מתוך האימות (JWT Middleware)

    const { dayType, mealType } = req.body;

    // שליפת נתוני הארוחות של המשתמש
    const mealData = await fetchMealDataForUser(userId);

    if (!mealData || mealData.length === 0) {
      return res.status(404).json({ error: 'No meal data found for this user.' });
    }

    // הכנת הנתונים לעץ ההחלטה
    const features = mealData.map(meal => [meal.day_type, meal.meal_type]);
    const labels = mealData.map(meal => meal.sugar_level);

    // אימון עץ החלטה
    const model = new mlcart.DecisionTreeClassifier();
    model.fit(features, labels);

    // חיזוי
    const prediction = model.predict([[dayType, mealType]]);

    res.status(200).json({ predicted_sugar_level: prediction[0] });
  } catch (error) {
    console.error('Error predicting sugar level:', error.message);
    res.status(500).json({ message: 'Failed to predict sugar level.', error: error.message });
  }
};

module.exports = { predictSugarLevel };
