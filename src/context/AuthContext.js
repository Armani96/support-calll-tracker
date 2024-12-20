// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const predefinedUsers = [
  { username: 'Armani', password: '123456!' },
  { username: 'Khio', password: '123456!' },
  { username: 'Sjors', password: '123456!'}
];

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const user = predefinedUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setIsAuthenticated(true);
      setUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
