process.stdout.setEncoding('utf8');

const express = require('express');
const app = express();
const mealRoutes = require('./routes/mealRoutes');
const botService = require('./services/botService'); // להפעיל את הבוט
const { runConsumer } = require('./services/consumerService'); // ייבוא הצרכן
const usdaRoutes = require('./routes/usdaRoutes');

// חיבור המסלול של USDA
app.use('/api/usda', usdaRoutes);

// Middlewares
app.use(express.json());

// Routes
app.use('/api/meals', mealRoutes);

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
