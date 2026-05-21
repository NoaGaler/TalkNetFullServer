import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import useMutation from '../hooks/useMutation';

const Login = () => {
  // שולפים בדיוק את אותם משתנים מה-Context כמו פעם!
  const { setCurrentUser, API_BASE } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // משתמשים ב-useMutation המקורי שלכן לצורך שליחת הנתונים לשרת
  const { mutate, loading } = useMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(''); // מאפסים שגיאות קודמות בכל ניסיון התחברות חדש

    try {
      // במקום לעשות GET ולבדוק את הסיסמה כאן, שולחים בקשת POST רשמית לשרת
      const response = await mutate(`${API_BASE}/login`, 'POST', { username, password });

      // אם השרת החזיר משתמש תקין
      if (response && response.user) {
        const userToSave = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email
        };

        // 🌟 המבנה המקורי והמדויק שלכן:
        setCurrentUser(userToSave);
        localStorage.setItem('currentUser', JSON.stringify(userToSave));
        
        // מעדכנים ועוברים לעמוד הבית
        navigate(`/${response.user.username}/home`);
      } else {
        setError('Incorrect username or password');
      }
    } catch (err) {
      // 🌟 תפיסת השגיאה מהשרת (כמו 401 או 411) בצורה חלקה ומעודנת!
      console.warn("Login rejected by server:", err.message);
      setError('Incorrect username or password');
    }
  };

  return (
    <div className="loginContainer">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
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
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { UserContext } from '../context/UserContext';
// import useFetch from '../hooks/useFetch';

// const Login = () => {
//   const { setCurrentUser, API_BASE } = useContext(UserContext);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const fetchUrl = username ? `${API_BASE}/users?username=${username}` : null;
//   const { data: users, loading } = useFetch(fetchUrl);

//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (loading) return;

//     const user = users?.[0];
//     if (user && user.website === password) {
//       const userToSave = {
//         id: user.id,
//         username: user.username,
//         email: user.email
//       };

//       setCurrentUser(userToSave);
//       localStorage.setItem('currentUser', JSON.stringify(userToSave));
//       navigate(`/${user.username}/home`);
//     } else {
//       setError('Incorrect username or password');
//     }
//   };
//   return (
//     <div className="loginContainer">
//       <h2>Log In</h2>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>User Name:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;