import React from 'react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ onNavigate, children, title }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('#login');
  };
  
  const navItems = [
    { name: 'Dashboard', hash: '#dashboard' },
    { name: 'Products', hash: '#products' },
    { name: 'Orders', hash: '#orders' },
    { name: 'Reports', hash: '#reports' },
  ];

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-64 text-white bg-gray-800">
        <div className="flex items-center justify-center h-16 text-2xl font-bold shadow-md">
          Inventory
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map(item => (
            <a
              key={item.name}
              href={item.hash}
              onClick={(e) => { e.preventDefault(); onNavigate(item.hash); }}
              className={`flex items-center px-4 py-2 rounded-md ${
                window.location.hash === item.hash
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="font-medium">{user?.name || user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 mt-4 text-sm font-medium text-left text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;