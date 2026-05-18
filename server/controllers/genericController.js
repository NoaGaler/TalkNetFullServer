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
    },

    // הוסיפי את הפונקציה הזו בתוך האובייקט GenericController ב-genericController.js
    delete: async (req, res) => {
        try {
            const table = req.params.table; // שם הטבלה (למשל: posts)
            const id = req.params.id;       // ה-ID של הפריט שרוצים למחוק
            const { current_user_id } = req.body; // הריאקט ישלח בגוף הבקשה את ה-ID של המשתמש המחובר כעת

            // אבטחה שלב א': וודאי שהריאקט בכלל שלח את ה-ID של המשתמש הנוכחי
            if (!current_user_id) {
                return res.status(400).json({ error: "Missing current_user_id for authentication" });
            }

            // אבטחה שלב ב': שולפים את הפריט הקיים מהדאטאבייס כדי לבדוק למי הוא שייך
            const existingItems = await GenericModel.getAll(table, { id: id });

            // אם הפריט לא קיים בכלל בדאטאבייס
            if (existingItems.length === 0) {
                return res.status(404).json({ error: "Item not found" });
            }

            const itemInDb = existingItems[0];

            // אבטחה שלב ג': הצלבת נתונים! בודקים האם ה-user_id של הפריט בדאטאבייס שווה ל-ID של מי שמנסה למחוק
            // שימי לב: אנחנו ממירים את שניהם ל-String למקרה שאחד הגיע כמספר ואחד כטקסט
            if (String(itemInDb.user_id) !== String(current_user_id)) {
                // אם ה-ID לא תואם - חוסמים את הפעולה מיד עם סטטוס 403 (Forbidden)
                return res.status(403).json({ error: "Access denied. You can only delete your own items!" });
            }

            // אם עברנו את כל הבדיקות - המשתמש הוא באמת הבעלים! אפשר למחוק בבטחה
            const isDeleted = await GenericModel.delete(table, id);

            if (isDeleted) {
                res.json({ message: "Item deleted successfully!" });
            } else {
                res.status(404).json({ error: "Item could not be deleted" });
            }

        } catch (err) {
            console.error("Database error in generic delete:", err);
            res.status(500).json({ error: "Server error deleting item" });
        }
    },

    // הוסיפי את הפונקציה הזו בתוך האובייקט GenericController ב-genericController.js
    update: async (req, res) => {
        try {
            const table = req.params.table; // שם הטבלה (למשל: posts)
            const id = req.params.id;       // ה-ID של הפריט שרוצים לעדכן

            // מפרידים את ה-ID של המשתמש לצורך אבטחה, ושומרים את שאר השדות לעדכון
            const { current_user_id, ...fieldsToUpdate } = req.body;

            // אבטחה שלב א': וודאי שהריאקט שלח את ה-ID של המשתמש הנוכחי
            if (!current_user_id) {
                return res.status(400).json({ error: "Missing current_user_id for authentication" });
            }

            // אבטחה שלב ב': שולפים את הפריט הקיים מהדאטאבייס כדי לבדוק בעלות
            const existingItems = await GenericModel.getAll(table, { id: id });

            if (existingItems.length === 0) {
                return res.status(404).json({ error: "Item not found" });
            }

            const itemInDb = existingItems[0];

            // אבטחה שלב ג': הצלבת נתונים - רק בעל הרשומה יכול לערוך!
            if (String(itemInDb.user_id) !== String(current_user_id)) {
                return res.status(403).json({ error: "Access denied. You can only edit your own items!" });
            }

            // אם עברנו את האבטחה - מעדכנים את הדאטאבייס רק בשדות שהשתנו (PATCH קלאסי)
            const isUpdated = await GenericModel.update(table, id, fieldsToUpdate);

            if (isUpdated) {
                // מחזירים תשובה חיובית עם השדות שעדכנו
                res.json({ message: "Item updated successfully!", updatedFields: fieldsToUpdate });
            } else {
                res.status(400).json({ error: "No changes were made or item could not be updated" });
            }

        } catch (err) {
            console.error("Database error in generic update:", err);
            res.status(500).json({ error: "Server error updating item" });
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


