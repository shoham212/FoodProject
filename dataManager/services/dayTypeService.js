const axios = require('axios');
const calendarificConfig = require('../config/calendarificConfig'); // ייבוא ההגדרות

const getDayType = async (date, meal_type) => {
  try {
    const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
    const year = new Date(date).getFullYear(); // הפקת השנה מתוך התאריך

    // יצירת כתובת URL עם ההגדרות
    const url = `${calendarificConfig.baseUrl}/holidays?api_key=${calendarificConfig.apiKey}&country=${calendarificConfig.country}&year=${year}&type=${calendarificConfig.holidayType}`;

    const response = await axios.get(url);

    // בדיקת החגים
    const holidays = response.data.response.holidays || [];
    const isHoliday = holidays.some(holiday => holiday.date.iso === formattedDate);

    // זיהוי היום בשבוע
    const day = new Date(date).getDay(); // 0 - ראשון, 6 - שבת

    if (day === 6 || (day === 5 && meal_type === 'evening')) {
      return 'Sabbath';
    } else if (isHoliday) {
      return 'holiday';
    } else {
      return 'weekday';
    }
  } catch (error) {
    console.error('שגיאה בקבלת סוג היום:', error.message);
    throw error;
  }
};

module.exports = { getDayType };
