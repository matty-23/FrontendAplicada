import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const UserContext = createContext();
const auth = new authService(); // Instanciamos el servicio

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('app_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const login = async (email, password) => {
    const data = await auth.login(email, password);
    setUser(data); 
    localStorage.setItem('app_user', JSON.stringify(data));
    
    return data;
  };

  const logout = async () => {
    await auth.logout();
    
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
    <UserContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </UserContext.Provider>
  );
};