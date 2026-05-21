import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AuthenticationApp.css';

const AuthenticationApp = () => {
  return (
    <div className="authWrapper">
      <div className="authHeader">
        <h1>TalkNet</h1>
        <p>Connect. Talk. Share.</p>
      </div>
      
      <div className="authToggle">
        <NavLink 
          to="/login" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          Login
        </NavLink>
        <NavLink 
          to="/register" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          Register
        </NavLink>
      </div>

      <hr />

      <div className="authContent">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticationApp;


