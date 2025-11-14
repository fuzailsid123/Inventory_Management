import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuth();
  
  if (!user && !token) {
    return <Login redirect={true} />;
  }

  return children;
};

export default ProtectedRoute;