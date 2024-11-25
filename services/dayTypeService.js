const axios = require('axios');

const getDayType = async (date, meal_type) => {
  try {
    const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
    const year = new Date(date).getFullYear(); // הפקת השנה מתוך התאריך
    const apiKey = process.env.CALENDARIFIC_API_KEY; // שימוש במפתח מהסביבה
    const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=IL&year=${year}&type=religious`;

    const response = await axios.get(url);

    // בדיקת החגים
    const holidays = response.data.response.holidays || [];
    const isHoliday = holidays.some(holiday => holiday.date.iso === formattedDate);

    // זיהוי היום בשבוע
    const day = new Date(date).getDay(); // 0 - ראשון, 6 - שבת

    if (day === 6 || (day === 5 && meal_type === 'ערב')) {
      return 'שבת';
    } else if (isHoliday) {
      return 'חג';
    } else {
      return 'יום חול';
    }
  } catch (error) {
    console.error('שגיאה בקבלת סוג היום:', error.message);
    throw error;
  }
};

module.exports = { getDayType };
