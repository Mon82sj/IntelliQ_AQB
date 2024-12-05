import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;

