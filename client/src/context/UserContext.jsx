import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  //for completeProfile
  const [isNewUser, setIsNewUser] = useState(false);
  //for checking in localStorage
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:3000";

  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      isNewUser, 
      setIsNewUser, 
      loading,
      API_BASE
    }}>
      {!loading && children}
    </UserContext.Provider>
  );
};


