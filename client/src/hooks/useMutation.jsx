import { useState, useCallback, useContext } from 'react';
import { UserContext } from '../context/UserContext'; // מושכים את הקונטקסט שלכן

const useMutation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useContext(UserContext); // שולפים את היוזר המחובר כרגע

    const mutate = useCallback(async (url, method, body = null) => {
        setLoading(true);
        setError(null);
        try {
            // 🌟 הזרקת מנגנון האבטחה של השרת החדש שלנו!
            // אם זו בקשה מסוג שינוי/מחיקה/הוספה ויש לנו יוזר שמור בסיסטם
            let updatedBody = body;
            if ((method === 'PATCH' || method === 'DELETE' || method === 'POST') && currentUser?.id) {
                updatedBody = {
                    ...body,
                    current_user_id: currentUser.id // השרת מצפה לקבל בדיוק את השדה הזה
                };
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: updatedBody ? JSON.stringify(updatedBody) : null
            });

            // טיפול חכם בשגיאות כדי שהריאקט יציג את סיבת השגיאה האמיתית מהשרת
            if (!response.ok) {
                const errText = await response.text();
                let errMsg = `Server error: ${response.status}`;
                try {
                    const errJson = JSON.parse(errText);
                    errMsg = errJson.error || errJson.message || errMsg;
                } catch (e) {}
                throw new Error(errMsg);
            }

            const text = await response.text();
            const result = text ? JSON.parse(text) : {};
            
            setLoading(false);
            return result;
        } catch (err) {
            setLoading(false);
            setError(err.message);
            throw err;
        }
    }, [currentUser]); // ה-Hook יתעדכן בכל פעם שהיוזר המחובר משתנה

    return { mutate, loading, error };
};

export default useMutation;





// import { useState, useCallback } from 'react';

// const useMutation = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const mutate = useCallback(async (url, method, body = null) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(url, {
//                 method,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: body ? JSON.stringify(body) : null
//             });

//             if (!response.ok) throw new Error(`Server error: ${response.status}`);

//             const text = await response.text();
//             const result = text ? JSON.parse(text) : {};
            
//             setLoading(false);
//             return result;
//         } catch (err) {
//             setLoading(false);
//             setError(err.message);
//             throw err;
//         }
//     }, []);

//     return { mutate, loading, error };
// };

// export default useMutation;



