import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

const ProtectedRoute = ({ children, onNavigate }) => {
  const { user, token } = useAuth();

  const nav = onNavigate || ((target) => { window.location.hash = target; });

  if (!user && !token) {
    return <Login redirect={true} onNavigate={nav} />;
  }

  return children;
};

export default ProtectedRoute;