const db = require('../config/db');

// login and register management
const User = {
    // מציאת משתמש + הסיסמה שלו בעזרת JOIN עבור תהליך ה-Login
    findByUsername: async (username) => {
        const sql = `
            SELECT users.*, passwords.password 
            FROM users 
            JOIN passwords ON users.id = passwords.user_id 
            WHERE users.username = ?`;
        const [rows] = await db.query(sql, [username]);
        return rows[0]; // מחזיר את המשתמש הראשון שנמצא או undefined
    },

    // יצירת משתמש חדש וסיסמה עבור תהליך ה-Register (כולל טלפון)
    create: async (userData) => {
        const { username, name, email, password, phone } = userData;
        const conn = await db.getConnection(); // לוקחים חיבור ספציפי לטרנזקציה
        
        try {
            await conn.beginTransaction();

            // 1. הכנסה לטבלת users כולל עמודת phone
            const [userResult] = await conn.query(
                'INSERT INTO users (username, name, email, phone) VALUES (?, ?, ?, ?)',
                [username, name, email, phone]
            );

            const userId = userResult.insertId;

            // 2. הכנסה לטבלת passwords עם ה-ID שנוצר
            await conn.query(
                'INSERT INTO passwords (user_id, password) VALUES (?, ?)',
                [userId, password]
            );

            await conn.commit();
            return userId;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }
};

module.exports = User;



// const db = require('../config/db');

// //login
// const User = {
//     // מציאת משתמש + הסיסמה שלו בעזרת JOIN
//     findByUsername: async (username) => {
//         const sql = `
//             SELECT users.*, passwords.password 
//             FROM users 
//             JOIN passwords ON users.id = passwords.user_id 
//             WHERE users.username = ?`;
//         const [rows] = await db.query(sql, [username]);
//         return rows[0]; // מחזיר את המשתמש הראשון שנמצא או undefined
//     },


//     //regsiter
//     create: async (userData) => {
//         const { username, name, email, password } = userData;
//         const conn = await db.getConnection(); // לוקחים חיבור ספציפי לטרנזקציה
        
//         try {
//             await conn.beginTransaction();

//             // 1. הכנסה לטבלת users
//             const [userResult] = await conn.query(
//                 'INSERT INTO users (username, name, email) VALUES (?, ?, ?)',
//                 [username, name, email]
//             );

//             const userId = userResult.insertId;

//             // 2. הכנסה לטבלת passwords
//             await conn.query(
//                 'INSERT INTO passwords (user_id, password) VALUES (?, ?)',
//                 [userId, password]
//             );

//             await conn.commit();
//             return userId;
//         } catch (err) {
//             await conn.rollback();
//             throw err;
//         } finally {
//             conn.release();
//         }
//     }
// };



// module.exports = User;