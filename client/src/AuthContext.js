import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create an Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Check if there is a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setUserToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login and store the token
  const login = (token) => {
    localStorage.setItem('token', token);
    setUserToken(token);
    setIsAuthenticated(true);
  };

  // Handle logout and clear the token
  const logout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

