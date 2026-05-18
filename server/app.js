const express = require('express');
const cors = require('cors');
// ייבוא הראוטרים (המלצרים של כל תחום)
const authRoutes = require('./routes/authRoutes');
const genericRoutes = require('./routes/genericRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// הגדרת נתיבים ראשיים
// כל מה שקשור ללוגין/הרשמה יתחיל בכתובת /auth
app.use('/auth', authRoutes);
app.use('/', genericRoutes); // Any other route will be handled by the generic router

// (אופציונלי) נתיב בדיקה כללי כדי לראות שהשרת חי
app.get('/', (req, res) => {
    res.send('TalkNet Server is running!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});