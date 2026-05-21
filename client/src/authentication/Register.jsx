import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import useMutation from '../hooks/useMutation';

const Register = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');

  const { setCurrentUser, setIsNewUser, API_BASE } = useContext(UserContext);
  const { mutate, loading } = useMutation(); // מונע לחיצות כפולות בזמן השליחה
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    // 🛑 בדיקות תקינות קפדניות בצד הקליינט לפני הפנייה לשרת
    if (!username.trim() || !name.trim() || !phone.trim() || !password || !verifyPassword) {
      setError('All fields are required!');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password !== verifyPassword) {
      setError('The passwords do not match');
      return;
    }

    try {
      // 🌟 אורזים בדיוק את כל שדות החובה שה-authController שלכן בבקאנד מצפה לקבל
      const serverPayload = {
        username: username.trim(),
        password: password,
        name: name.trim(),
        phone: phone.trim()
      };

      // מבצעים בקשת POST רשמית לרישום המשתמש בדאטאבייס
      const response = await mutate(`${API_BASE}/register`, 'POST', serverPayload);

      // השרת מחזיר response.userId בזמן רישום מוצלח
      if (response && response.userId) {
        setIsNewUser(true);

        // שומרים ב-Context וב-LocalStorage את נתוני המשתמש (האימייל נשאר ריק זמנית)
        const userToSave = {
          id: response.userId,
          username: username.trim(),
          name: name.trim(),
          phone: phone.trim(),
          email: "" // ריק, כדי ש-App.jsx יזהה שהפרופיל עוד לא הושלם במלואו
        };

        setCurrentUser(userToSave);
        localStorage.setItem('currentUser', JSON.stringify(userToSave));

        alert("Account created successfully! Now, let's complete your profile.");
        
        // מעבירים בצורה בטוחה לעמוד השלמת הפרופיל והזנת המייל
        navigate(`/${username.trim()}/completeProfile`);
      }
    } catch (err) {
      // תופס שגיאות מהשרת (למשל אם ה-Username כבר תפוס בדאטאבייס)
      setError(err.message || 'Registration failed. Username might already be taken.');
    }
  };

  return (
    <div className="registerContainer">
      <h2>Sign Up</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>User Name:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Verify Password:</label>
          <input 
            type="password" 
            value={verifyPassword} 
            onChange={(e) => setVerifyPassword(e.target.value)} 
            required 
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;




// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../context/UserContext';
// import useMutation from '../hooks/useMutation';

// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [verifyPassword, setVerifyPassword] = useState('');
//   const [error, setError] = useState('');

//   const { setCurrentUser, setIsNewUser, API_BASE } = useContext(UserContext);
//   const { mutate, loading } = useMutation();
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setError('');

//     // 🛑 בדיקות קפדניות בצד הקליינט (אף אחד לא סומך על המשתמש)
//     if (!username.trim() || !name.trim() || !phone.trim() || !password || !verifyPassword) {
//       setError('All fields are required!');
//       return;
//     }

//     if (username.trim().length < 3) {
//       setError('Username must be at least 3 characters long');
//       return;
//     }

//     if (password !== verifyPassword) {
//       setError('The passwords do not match');
//       return;
//     }

//     try {
//       // אורזים בדיוק את השדות שה-authController שלכן מצפה לקבל ב-body!
//       const serverPayload = {
//         username: username.trim(),
//         password: password,
//         name: name.trim(),
//         phone: phone.trim()
//       };

//       const response = await mutate(`${API_BASE}/register`, 'POST', serverPayload);

//       if (response && response.userId) {
//         setIsNewUser(true);

//         // שומרים ב-Context את הנתונים שהרגע נוצרו (האימייל נשאר ריק זמנית)
//         const userToSave = {
//           id: response.userId,
//           username: username.trim(),
//           name: name.trim(),
//           phone: phone.trim(),
//           email: "" // ריק, כדי ש-App.jsx יזהה שהפרופיל עוד לא הושלם במלואו
//         };

//         setCurrentUser(userToSave);
//         localStorage.setItem('currentUser', JSON.stringify(userToSave));

//         alert("Account created successfully! Now, let's complete your profile.");
//         navigate(`/${username.trim()}/completeProfile`);
//       }
//     } catch (err) {
//       setError(err.message || 'Registration failed. Username might already be taken.');
//     }
//   };

//   return (
//     <div className="registerContainer">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleRegister}>
//         <div>
//           <label>User Name:</label>
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         </div>
//         <div>
//           <label>Full Name:</label>
//           <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
//         </div>
//         <div>
//           <label>Phone Number:</label>
//           <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <div>
//           <label>Verify Password:</label>
//           <input type="password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} required />
//         </div>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit" disabled={loading}>
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;





// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../context/UserContext';
// import useFetch from '../hooks/useFetch';
// import useMutation from '../hooks/useMutation';

// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [verifyPassword, setVerifyPassword] = useState('');
//   const [error, setError] = useState('');

//   const { setCurrentUser, setIsNewUser, API_BASE } = useContext(UserContext);
//   const { mutate } = useMutation();
//   const navigate = useNavigate();

//   const fetchUrl = username ? `${API_BASE}/users?username=${username}` : null;
//   const { data: existingUsers } = useFetch(fetchUrl);

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (password !== verifyPassword) {
//       setError('The passwords do not match');
//       return;
//     }

//     if (existingUsers?.length > 0) {
//       setError('Username already taken');
//       return;
//     }

//     try {
//       const newUser = {
//         username: username,
//         website: password
//       };

//       const createdUser = await mutate(`${API_BASE}/users`, 'POST', newUser);

//       if (createdUser) {
//         setIsNewUser(true);

//         const userToSave = {
//           id: createdUser.id,
//           username: createdUser.username,
//           email: ""
//         };

//         setCurrentUser(userToSave);
//         localStorage.setItem('currentUser', JSON.stringify(userToSave));

//         navigate(`/${createdUser.username}/completeProfile`);
//       }

//     } catch (err) {
//       setError('Registration error');
//     }
//   };

//   return (
//     <div className="registerContainer">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleRegister}>
//         <div>
//           <label>User Name:</label>
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <div>
//           <label>Verify Password:</label>
//           <input type="password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} required />
//         </div>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// };

// export default Register;