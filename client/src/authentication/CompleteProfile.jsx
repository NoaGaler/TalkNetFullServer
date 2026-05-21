import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import useMutation from '../hooks/useMutation'; 
import logo from '../attachments/logo.png';
import './CompleteProfile.css';

const CompleteProfile = () => {
  const { currentUser, setCurrentUser, setIsNewUser, API_BASE } = useContext(UserContext);
  const { mutate, loading } = useMutation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      // שולחים רק את השדה הראשי שרוצים לעדכן בטבלת המשתמשים!
      // (ה-useMutation המשודרג כבר יוסיף את ה-current_user_id לבד!)
      const updatedFields = {
        email: email.trim()
      };

      // מבצעים את ה-PATCH הגנרי לשרת: PATCH /users/5
      const data = await mutate(`${API_BASE}/users/${currentUser.id}`, 'PATCH', updatedFields);

      if (data) {
        // הצלחה! מעדכנים את ה-Context וה-LocalStorage קומפלט
        const updatedSessionUser = {
          ...currentUser,
          email: email.trim()
        };

        setCurrentUser(updatedSessionUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedSessionUser));

        setIsNewUser(false);

        alert("Profile completed successfully! Welcome to TalkNet.");
        navigate(`/${currentUser.username}/home`);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to save email. Try again.");
    }
  };

  return (
    <div className="authWrapper">
      <div className="topLogoContainer">
        <img src={logo} alt="TalkNet Logo" className="topLogo" />
      </div>

      <div className="authHeader">
        <h1>Welcome, {currentUser?.username}! 🎉</h1>
        <p>Please enter your email to finalize your registration.</p>
      </div>

      <div className="completeProfileCard">
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
          <section className="formSection">
            <h3>Final Security Verification</h3>
            <label>Email Address:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com" 
              required 
            />
          </section>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving Email...' : 'Finish & Enter TalkNet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;






// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../context/UserContext';
// import useMutation from '../hooks/useMutation'; 
// import logo from '../attachments/logo.png';
// import './CompleteProfile.css';

// const CompleteProfile = () => {
//   const { currentUser, setCurrentUser, setIsNewUser, API_BASE } = useContext(UserContext);
//   const { mutate, loading } = useMutation();
//   const navigate = useNavigate();
  
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setError('');

//     // 🛑 ולידציה בקליינט - בודקים את המשתמש
//     if (!email.trim()) {
//       setError('Email address is required to complete registration.');
//       return;
//     }

//     if (!email.includes('@')) {
//       setError('Please enter a valid email address.');
//       return;
//     }

//     try {
//       // אובייקט עדכון שטוח שמתאים בול לטבלת users
//       const updatedFieldsForServer = {
//         current_user_id: currentUser.id, // חובת אבטחה גנרית להצלבת יוזרים בשרת
//         email: email.trim()
//       };

//       // מעדכנים את השורה הקיימת בדאטאבייס: PATCH /users/:id
//       const response = await mutate(`${API_BASE}/users/${currentUser.id}`, 'PATCH', updatedFieldsForServer);

//       if (response) {
//         // מעדכנים את ה-Context וה-LocalStorage באובייקט המלא הסופי!
//         const updatedSessionUser = {
//           ...currentUser,
//           email: email.trim()
//         };

//         setCurrentUser(updatedSessionUser);
//         localStorage.setItem('currentUser', JSON.stringify(updatedSessionUser));

//         setIsNewUser(false);

//         alert("Profile completed successfully! Welcome to TalkNet.");
//         navigate(`/${currentUser.username}/home`);
//       }
//     } catch (err) {
//       console.error("Profile complete failed:", err);
//       setError('Failed to save email. Make sure it is unique.');
//     }
//   };

//   return (
//     <div className="authWrapper">
//       <div className="topLogoContainer">
//         <img src={logo} alt="TalkNet Logo" className="topLogo" />
//       </div>

//       <div className="authHeader">
//         <h1>Welcome, {currentUser?.username}! 🎉</h1>
//         <p>Please enter your email to finalize your registration.</p>
//       </div>

//       <div className="completeProfileCard">
//         <form onSubmit={handleSubmit}>
//           {error && <p style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}
          
//           <section className="formSection">
//             <h3>Final Security Verification</h3>
            
//             <label>Email Address:</label>
//             <input 
//               type="email" 
//               value={email} 
//               onChange={(e) => setEmail(e.target.value)} 
//               placeholder="name@example.com" 
//               required 
//             />
//           </section>

//           <button type="submit" disabled={loading}>
//             {loading ? 'Saving Email...' : 'Finish & Enter TalkNet'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CompleteProfile;







// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../context/UserContext';
// import useMutation from '../hooks/useMutation'; 
// import logo from '../attachments/logo.png';
// import './CompleteProfile.css';

// const CompleteProfile = () => {
//   const { currentUser, setCurrentUser, setIsNewUser, API_BASE } = useContext(UserContext);
//   const { mutate } = useMutation();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     street: '',
//     suite: '',
//     city: '',
//     zipcode: '',
//     lat: '',
//     lng: '',
//     companyName: '',
//     catchPhrase: '',
//     bs: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const updatedUser = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       address: {
//         street: formData.street,
//         suite: formData.suite,
//         city: formData.city,
//         zipcode: formData.zipcode,
//         geo: {
//           lat: formData.lat,
//           lng: formData.lng
//         }
//       },
//       company: {
//         name: formData.companyName,
//         catchPhrase: formData.catchPhrase,
//         bs: formData.bs
//       }
//     };

//     try {
//       const data = await mutate(`${API_BASE}/users/${currentUser.id}`, 'PATCH', updatedUser);

//       if (data) {
//         const updatedSessionUser = {
//           id: data.id,
//           username: data.username,
//           email: data.email
//         };

//         setCurrentUser(updatedSessionUser);
//         localStorage.setItem('currentUser', JSON.stringify(updatedSessionUser));

//         setIsNewUser(false);

//         alert("Profile updated successfully!");
//         navigate(`/${data.username}/home`);
//       }
//     } catch (err) {
//       console.error("Error updating profile:", err);
//     }
//   };

//   return (
//     <div className="authWrapper">
//       <div className="topLogoContainer">
//         <img src={logo} alt="TalkNet Logo" className="topLogo" />
//       </div>

//       <div className="authHeader">
//         <h1>Final Steps, {currentUser?.username} :)</h1>
//         <p>Please fill in your details to complete your registration.</p>
//       </div>

//       <div className="completeProfileCard">
//         <form onSubmit={handleSubmit}>
//           <section className="formSection">
//             <h3>Personal Identity</h3>
//             <label>Full Name:</label>
//             <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Leanne Graham" required />
//             <label>Email:</label>
//             <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Sincere@april.biz" required />
//             <label>Phone:</label>
//             <input name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder="1-770-736-8031" />
//           </section>

//           <section className="formSection">
//             <h3>Address Details</h3>
//             <div className="inputGroup">
//               <div>
//                 <label>City:</label>
//                 <input name="city" type="text" value={formData.city} onChange={handleChange} placeholder="Gwenborough" />
//               </div>
//               <div>
//                 <label>Street:</label>
//                 <input name="street" type="text" value={formData.street} onChange={handleChange} placeholder="Kulas Light" />
//               </div>
//             </div>
//             <div className="inputGroup">
//               <div>
//                 <label>Suite:</label>
//                 <input name="suite" type="text" value={formData.suite} onChange={handleChange} placeholder="Apt. 556" />
//               </div>
//               <div>
//                 <label>Zipcode:</label>
//                 <input name="zipcode" type="text" value={formData.zipcode} onChange={handleChange} placeholder="92998-3874" />
//               </div>
//             </div>
//             <div className="inputGroup">
//               <div>
//                 <label>Latitude:</label>
//                 <input name="lat" type="text" value={formData.lat} onChange={handleChange} placeholder="-37.3159" />
//               </div>
//               <div>
//                 <label>Longitude:</label>
//                 <input name="lng" type="text" value={formData.lng} onChange={handleChange} placeholder="81.1496" />
//               </div>
//             </div>
//           </section>

//           <section className="formSection">
//             <h3>Company Information</h3>
//             <label>Company Name:</label>
//             <input name="companyName" type="text" value={formData.companyName} onChange={handleChange} placeholder="Romaguera-Crona" />
//             <label>Catch Phrase:</label>
//             <input name="catchPhrase" type="text" value={formData.catchPhrase} onChange={handleChange} placeholder="Multi-layered client-server" />
//             <label>Business Strategy (BS):</label>
//             <input name="bs" type="text" value={formData.bs} onChange={handleChange} placeholder="harness real-time e-markets" />
//           </section>

//           <button type="submit">Save & Finish</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CompleteProfile;

