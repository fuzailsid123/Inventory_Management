import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Reports from './pages/Reports';

const Router = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(window.location.hash || '#login');
  
  const handleNav = (targetPage) => {
    window.location.hash = targetPage;
    setPage(targetPage);
  };

  useEffect(() => {
    const handleHashChange = () => {
      setPage(window.location.hash || (user ? '#dashboard' : '#login'));
    };
    
    if (!user && page !== '#register') {
      handleNav('#login');
    } else if (user && (page === '#login' || page === '#register' || page === '')) {
      handleNav('#dashboard');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  const renderPage = () => {
    switch (page) {
      case '#login':
        return <Login onNavigate={handleNav} />;
      case '#register':
        return <Register onNavigate={handleNav} />;
      case '#dashboard':
        return <ProtectedRoute><Dashboard onNavigate={handleNav} /></ProtectedRoute>;
      case '#products':
        return <ProtectedRoute><Products onNavigate={handleNav} /></ProtectedRoute>;
      case '#orders':
        return <ProtectedRoute><Orders onNavigate={handleNav} /></ProtectedRoute>;
      case '#reports':
        return <ProtectedRoute><Reports onNavigate={handleNav} /></ProtectedRoute>;
      default:
        return <ProtectedRoute><Dashboard onNavigate={handleNav} /></ProtectedRoute>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderPage()}
    </div>
  );
};

export default Router;