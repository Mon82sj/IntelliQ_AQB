import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create an Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there is a token in localStorage
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedUserType = localStorage.getItem('userType');
    if (token) {
      setUserToken(token);
      setUsername(storedUsername);
      setUserType(storedUserType);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login and store the token, username, and userType
  const login = (token, username, userType) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userType', userType);
    setUserToken(token);
    setUsername(username);
    setUserType(userType);
    setIsAuthenticated(true);
  };

  // Handle logout and clear the token
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    setUserToken(null);
    setUsername(null);
    setUserType(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userToken, username, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

