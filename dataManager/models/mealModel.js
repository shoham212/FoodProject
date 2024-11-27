class Meal {
  constructor(id, meal, meal_type, description, sugar_level, sugar_level_after_two_hours, date, image_url, day_type) {
    this.id = id;
    this.meal = meal;
    this.meal_type = meal_type;
    this.description = description;
    this.sugar_level = sugar_level; 
    this.sugar_level_after_two_hours = sugar_level_after_two_hours;
    this.date = date;
    this.image_url = image_url;
    this.day_type = day_type;
  }
}

module.exports = Meal;
