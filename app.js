const express = require('express');
const { sql, connectToDatabase } = require('./config/dbConfig');
const userRoutes = require('./routes/userRoutes');
const mealRoutes = require('./routes/mealRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
app.use(express.json());

connectToDatabase();

app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/images', imageRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
