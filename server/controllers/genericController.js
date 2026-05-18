const GenericModel = require('../models/genericModel');

// אובייקט אחד מרכזי שמאגד את כל פעולות השרת הגנריות
const GenericController = {
    
    // 1. הבאת כל הנתונים מהטבלה (או סינון מורכב דרך URL query)
    getAll: async (req, res) => {
        try {
            const table = req.params.table;
            const filter = req.query; // תופס פרמטרים שאחרי הסימן ? (למשל: ?user_id=1)

            const items = await GenericModel.getAll(table, filter);
            res.json(items);
        } catch (err) {
            console.error("Database error in generic getAll:", err);
            res.status(500).json({ error: "Server error retrieving data" });
        }
    }, // פסיק חובה בין מתודות באובייקט!

    // 2. הבאת פריט בודד לפי ID מתוך הכתובת (למשל: /users/1)
    getById: async (req, res) => {
        try {
            const table = req.params.table; // שולף את שם הטבלה (למשל: users)
            const id = req.params.id;       // שולף את ה-ID מהכתובת (למשל: 1)

            // שולחים למודל הקיים אובייקט סינון ממוקד שמכיל את ה-ID
            const items = await GenericModel.getAll(table, { id: id });

            // אם הדאטאבייס חזר ריק, זה אומר שאין פריט עם ה-ID הזה
            if (items.length === 0) {
                return res.status(404).json({ error: "Item not found" });
            }

            // מחזירים רק את האובייקט הראשון שמצאנו (בלי סוגריים של מערך)
            res.json(items[0]);
        } catch (err) {
            console.error("Database error in generic getById:", err);
            res.status(500).json({ error: "Server error retrieving item" });
        }
    }, // פסיק חובה בין מתודות באובייקט!

    // 3. יצירת שורה חדשה בדאטאבייס (בקשת POST גנרית להוספת פוסט/תגובה/משימה)
    create: async (req, res) => {
        try {
            const table = req.params.table; // שולף את שם הטבלה מהכתובת (למשל: comments)
            const data = req.body;          // שולף את גוף המידע שנשלח מהלקוח (כולל כל הקישורים)

            // קריאה למודל הגנרי ליצירת השורה החדשה בדאטאבייס
            const newItem = await GenericModel.create(table, data);

            // מחזירים סטטוס 201 (נוצר בהצלחה) ואת האובייקט המלא שנוצר כולל ה-ID שלו
            res.status(201).json(newItem);
        } catch (err) {
            console.error("Database error in generic create:", err);
            res.status(500).json({ error: "Server error creating item" });
        }
    }
};

// מייצאים את כל האובייקט השלם של הדף ביחד, נקי ומסודר!
module.exports = GenericController;






// const GenericModel = require('../models/genericModel');

// // פונקציה קיימת: הבאת כל הנתונים מהטבלה (או סינון מורכב)
// const getAll = async (req, res) => {
//     try {
//         const table = req.params.table;
//         const filter = req.query; // תופס פרמטרים שאחרי הסימן ?

//         const items = await GenericModel.getAll(table, filter);
//         res.json(items);
//     } catch (err) {
//         console.error("Database error in generic getAll:", err);
//         res.status(500).json({ error: "Server error retrieving data" });
//     }
// };

// // פונקציה חדשה: הבאת פריט בודד לפי ID מתוך הכתובת
// const getById = async (req, res) => {
//     try {
//         const table = req.params.table; // שולף את שם הטבלה מהכתובת (למשל: users)
//         const id = req.params.id;       // שולף את ה-ID מהכתובת (למשל: 1)

//         // שימוש חכם: שולחים למודל הקיים אובייקט סינון ממוקד שמכיל את ה-ID
//         const items = await GenericModel.getAll(table, { id: id });

//         // אם הדאטאבייס חזר ריק, זה אומר שאין פריט עם ה-ID הזה
//         if (items.length === 0) {
//             return res.status(404).json({ error: "Item not found" });
//         }

//         // מחזירים רק את האובייקט הראשון שמצאנו (בלי סוגריים של מערך)
//         res.json(items[0]);
//     } catch (err) {
//         console.error("Database error in generic getById:", err);
//         res.status(500).json({ error: "Server error retrieving item" });
//     };

//     // הוסיפי את הפונקציה הזו ב-genericController.js
//     const create = async (req, res) => {
//         try {
//             const table = req.params.table; // שולף את שם הטבלה מהכתובת (למשל: comments)
//             const data = req.body;          // שולף את גוף המידע שנשלח מהלקוח (כולל כל הקישורים!)

//             // קריאה למודל הגנרי ליצירת השורה החדשה בדאטאבייס
//             const newItem = await GenericModel.create(table, data);

//             // מחזירים סטטוס 201 (נוצר בהצלחה) ואת האובייקט המלא שנוצר כולל ה-ID שלו
//             res.status(201).json(newItem);
//         } catch (err) {
//             console.error("Database error in generic create:", err);
//             res.status(500).json({ error: "Server error creating item" });
//         }
//     };


// };

// module.exports = GenericController;


