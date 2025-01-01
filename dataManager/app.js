process.stdout.setEncoding('utf8');

const express = require('express');
const app = express();
const path = require('path'); // ייבוא מודול path
const userRoutes = require('./routes/userRoutes'); // ייבוא נתיבי משתמשים
const mealRoutes = require('./routes/mealRoutes');
const usdaRoutes = require('./routes/USDARoutes');
const botService = require('./services/botService'); // להפעיל את הבוט
const { runConsumer } = require('./services/consumerService'); // ייבוא הצרכן
const { authenticateToken } = require('./services/authMiddleware'); // ייבוא Middleware
const contactRoutes = require('./routes/contactRoutes');
const mealsHistoryRoutes = require("./routes/mealsHistoryRoutes");//Meals history related routes

app.use("/history", mealsHistoryRoutes);//etc.

// מסלול לדף הבית
app.get('/add', (req, res) => {
  res.render('pages/addMeal'); // טוען את index.ejs מתיקיית pages
});

// הגדרת מנוע התבניות EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// הגדרת תיקיית הקבצים הסטטיים
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.json());

// מסלול לדף הבית
app.get('/', (req, res) => {
  res.render('pages/index'); // טוען את index.ejs מתיקיית pages
});


app.get('/home', (req, res) => {
    res.render('pages/home');
});

app.use('/', contactRoutes);


// חיבור מסלולי משתמשים
app.use(userRoutes);

app.use('/usda', authenticateToken, usdaRoutes);

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
