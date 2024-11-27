const express = require('express');
const app = express();
const producerRoutes = require('./routes/producerRoutes'); // הוספת הראוטים של ה-Producer

app.use(express.json());

// הוספת הנתיב של הראוט
app.use('/produce', producerRoutes);

const PORT = 6000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
