const calendarificConfig = {
    apiKey: process.env.CALENDARIFIC_API_KEY, // מפתח ה-API מתוך משתני הסביבה
    baseUrl: 'https://calendarific.com/api/v2', // כתובת הבסיס של ה-API
    country: 'IL', // המדינה (ישראל במקרה הזה)
    holidayType: 'religious', // סוג החגים הרצוי
  };
  
  module.exports = calendarificConfig;
  