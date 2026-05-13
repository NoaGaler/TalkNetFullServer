const express = require('express');
const mysql = require('mysql2'); // השורה הזו הייתה חסרה!
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// יצירת ה-Pool בדיוק לפי המצגת
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'bugv1827', // הקישי את הסיסמה שלך כאן
    database: 'talknet_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// הפיכת ה-Pool לעבודה עם Promises (async/await)
const db = pool.promise();

// נתיב בדיקה ל-Thunder Client
app.get('/users', async (req, res) => {
    console.log("Someone just asked for the users list!"); // שורה חדשה להדפסה
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



// // יצירת ה-Pool בדיוק לפי המצגת
// const pool = mysql.createPool({
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'bugv1827', // הסיסמה שלך
//     database: 'talknet_db',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// // שימוש ב-promise() מאפשר לנו לעבוד עם async/await בצורה מודרנית
// const db = pool.promise();

// // נתיב הבדיקה המעודכן (שימוש ב-Async/Await)
// app.get('/users', async (req, res) => {
//     try {
//         const [rows] = await db.query('SELECT * FROM users');
//         res.json(rows);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });