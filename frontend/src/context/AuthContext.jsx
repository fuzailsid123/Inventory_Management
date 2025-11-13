// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { getCurrentUser, isAuthenticated as checkAuth } from '../api/client.js';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (checkAuth()) {
//       setUser(getCurrentUser());
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData) => {
//     setUser(userData.user);
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// }

