import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('app_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData); 
    localStorage.setItem('app_user', JSON.stringify(userData)); // Guarda en disco
  };

  const logout = () => {
    setUser(null); 
    localStorage.removeItem('app_user'); 
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'app_user') {
        if (event.newValue) {
          setUser(JSON.parse(event.newValue)); 
        } else {
          setUser(null); 
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
