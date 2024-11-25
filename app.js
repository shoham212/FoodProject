process.stdout.setEncoding('utf8');

const express = require('express');
const app = express();
const mealRoutes = require('./routes/mealRoutes');
const botService = require('./services/botService'); // להפעיל את הבוט


// Middlewares
app.use(express.json());

// Routes
app.use('/api/meals', mealRoutes);

// הפעלת הבוט של Telegram
botService.startBot(); // פונקציה מתוך botService שמתחילה להפעיל את הבוט

// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
