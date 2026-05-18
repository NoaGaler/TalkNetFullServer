const db = require('../config/db');

const GenericModel = {
    getAll: async (table, filter = {}) => {
        let sql = `SELECT * FROM ??`;
        const params = [table];

        // If there are filters (e.g., ?id=1)
        const keys = Object.keys(filter);
        if (keys.length > 0) {
            // Map each key to "key = ?" (e.g., ["id = ?"])
            const filterConditions = keys.map(key => `?? = ?`);
            sql += ` WHERE ` + filterConditions.join(' AND ');

            // Push the column names and values alternately into params
            keys.forEach(key => {
                params.push(key);      // Replaces the first ??
                params.push(filter[key]); // Replaces the subsequent ?
            });
        }

        const [rows] = await db.query(sql, params);
        return rows;
    },
    // הוסיפי את הפונקציה הזו בתוך האובייקט GenericModel ב-genericModel.js
    create: async (table, data) => {
        // השאילתה משתמשת ב-?? עבור שם הטבלה וב-? שמקבל אובייקט שלם ומפרק אותו ל-SET key=value
        const sql = `INSERT INTO ?? SET ?`;

        // params מכיל את שם הטבלה ואת אובייקט הנתונים שהגיע מהקונטרולר
        const [result] = await db.query(sql, [table, data]);

        // מחזירים אובייקט חדש שמכיל את ה-ID שנוצר בדאטאבייס יחד עם כל הנתונים המקוריים
        return { id: result.insertId, ...data };
    },

    delete: async (table, id) => {
        // שאילתת מחיקה שמבוססת על שם טבלה דינמי ו-ID ספציפי
        const sql = `DELETE FROM ?? WHERE id = ?`;

        const [result] = await db.query(sql, [table, id]);

        // מחזירים true אם באמת נמחקה שורה בדאטאבייס
        return result.affectedRows > 0;
    },

    update: async (table, id, data) => {
        // השאילתה משתמשת ב-?? עבור שם הטבלה, ב-? הראשון עבור אובייקט הנתונים (SET שדה=ערך) וב-? השני עבור ה-ID
        const sql = `UPDATE ?? SET ? WHERE id = ?`;

        const [result] = await db.query(sql, [table, data, id]);

        // מחזירים true אם באמת עודכנה שורה בדאטאבייס
        return result.affectedRows > 0;
    }

};

module.exports = GenericModel;




// const db = require('../config/db');

// const GenericModel = {
//     // פונקציה להבאת כל הנתונים מטבלה (תומכת גם בסינונים כמו ?userId=1)
//     getAll: async (table, filter = {}) => {
//         // המזהה ?? משמש ב-mysql2 עבור שמות של טבלאות או עמודות
//         let sql = `SELECT * FROM ??`;
//         const params = [table];

//         // אם שלחו סינון בכתובת (למשל: ?userId=1)
//         if (Object.keys(filter).length > 0) {
//             sql += ` WHERE ?`;
//             params.push(filter); // mysql2 הופך את האובייקט {user_id: 1} ל-user_id = 1 באופן אוטומטי
//         }

//         const [rows] = await db.query(sql, params);
//         return rows;
//     }
// };

// module.exports = GenericModel;