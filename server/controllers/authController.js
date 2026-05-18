const User = require('../models/userModel');

// מאגדים את כל הפונקציות של הדף בתוך אובייקט אחד מסודר בשם AuthController
const AuthController = {
    // 1. פונקציית התחברות (Login) - שימי לב שאין const, כותבים ישר את שם המפתח!
    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findByUsername(username);

            if (!user || user.password !== password) {
                return res.status(401).json({ message: "Wrong username or password" });
            }

            // החזרת פרטי המשתמש ללא הסיסמה שלו
            const { password: _, ...userWithoutPassword } = user;
            res.json({ message: "You have connected successfully!", user: userWithoutPassword });

        } catch (err) {
            console.error("Login server error:", err);
            res.status(500).json({ message: "Server Error" });
        }
    }, // פסיק שמפריד בין האיברים באובייקט!

    // 2. פונקציית הרשמה (Register) - גם כאן בלי const!
    register: async (req, res) => {
        const { username, name, email, password, phone } = req.body;

        // בדיקה 1: אורך שם המשתמש (לפחות 3 תווים)
        if (!username || username.trim().length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters long" });
        }

        // בדיקה 2: חובת מספר טלפון
        if (!phone || phone.trim().length === 0) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        try {
            // אם הכל תקין, ממשיכים לשמירה בדאטאבייס
            const userId = await User.create({ username, name, email, password, phone });
            res.status(201).json({ message: "User registered successfully!", userId });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Username or Email already exists" });
            }
            console.error("Registration server error:", err);
            res.status(500).json({ message: "Server Error" });
        }
    }
};

// מייצאים את האובייקט בדיוק באותו השם שהגדרנו למעלה (אות גדולה!)
module.exports = AuthController;







// const User = require('../models/userModel');

// const login = async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findByUsername(username);

//         if (!user || user.password !== password) {
//             return res.status(401).json({ message: "Wrong username or password" });
//         }

//         const { password: _, ...userWithoutPassword } = user;
//         res.json({ message: "You have connected successfully!", user: userWithoutPassword });

//     } catch (err) {
//         console.error("Login server error:", err);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// const register = async (req, res) => {
//     const { username, name, email, password, phone } = req.body;

//     // בדיקה 1: אורך שם המשתמש (לפחות 3 תווים)
//     if (!username || username.trim().length < 3) {
//         return res.status(400).json({ message: "Username must be at least 3 characters long" });
//     }

//     // בדיקה 2: חובת מספר טלפון
//     if (!phone || phone.trim().length === 0) {
//         return res.status(400).json({ message: "Phone number is required" });
//     }

//     try {
//         // אם הכל תקין, ממשיכים לשמירה בדאטאבייס
//         const userId = await User.create({ username, name, email, password, phone });
//         res.status(201).json({ message: "User registered successfully!", userId });
//     } catch (err) {
//         if (err.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({ message: "Username or Email already exists" });
//         }
//         console.error("Registration server error:", err);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// module.exports = authController;
// //module.exports = { login, register };



