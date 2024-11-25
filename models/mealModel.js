class Meal {
  constructor(id, meal, meal_type, description, sugarLevel, date, image_url, day_type) {
    this.id = id;
    this.meal = meal;
    this.meal_type = meal_type;
    this.description = description;
    this.sugarLevel = sugarLevel;
    this.date = date;
    this.image_url = image_url;
    this.day_type = day_type;
  }
}

module.exports = Meal;
