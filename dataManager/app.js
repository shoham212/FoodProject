process.stdout.setEncoding('utf8');

const express = require('express');
const app = express();
const mealRoutes = require('./routes/mealRoutes');
const usdaRoutes = require('./routes/usdaRoutes');
const botService = require('./services/botService'); // להפעיל את הבוט
const { runConsumer } = require('./services/consumerService'); // ייבוא הצרכן
const { authenticateToken } = require('./middlewares/authMiddleware'); // ייבוא Middleware

// Middlewares
app.use(express.json());

// Static Middleware (אפשר להחזיר אם יש צורך בקבצים סטטיים)
// app.use(express.static('public'));

// מסלולים מאומתים
app.use('/api/meals', authenticateToken, mealRoutes);
app.use('/api/usda', authenticateToken, usdaRoutes);

// הפעלת הבוט של Telegram
try {
    botService.startBot();
    console.log('Telegram bot is running!');
} catch (err) {
    console.error('Error starting Telegram bot:', err);
}

// הפעלת Kafka Consumer
runConsumer()
    .then(() => console.log('Kafka consumer is running!'))
    .catch((err) => console.error('Error running Kafka consumer:', err));

// Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
