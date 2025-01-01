class Meal {
  constructor(
    id,
    meal,
    meal_type,
    description,
    sugar_level,
    sugar_level_after_two_hours,
    date,
    day_type,
    user_id // שדה חדש לקישור משתמש לארוחה
  ) {
    this.id = id;
    this.meal = meal;
    this.meal_type = meal_type;
    this.description = description;
    this.sugar_level = sugar_level;
    this.sugar_level_after_two_hours = sugar_level_after_two_hours;
    this.date = date;
    this.day_type = day_type;
    this.user_id = user_id; // מזהה המשתמש
  }
}

module.exports = Meal;
