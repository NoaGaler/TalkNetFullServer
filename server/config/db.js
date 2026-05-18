const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'bugv1827', // הסיסמה שלך
    database: 'talknet_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// אנחנו מייצאים את הגרסה של ה-promise כדי שנוכל להשתמש ב-await
module.exports = pool.promise();