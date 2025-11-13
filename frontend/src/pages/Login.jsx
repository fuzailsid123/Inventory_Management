// import React, { useState } from 'react';
// import { useNavigate, Navigate } from 'react-router-dom';
// import { login, register } from '../api/client.js';
// import { useAuth } from '../context/AuthContext.jsx';

// export default function Login() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login: setAuth, isAuthenticated } = useAuth();

//   if (isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       let result;
//       if (isLogin) {
//         result = await login(form.email, form.password);
//       } else {
//         result = await register(form);
//       }
//       setAuth(result);
//       navigate('/');
//     } catch (err) {
//       setError(err.message || 'Authentication failed');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
//       <h2>{isLogin ? 'Login' : 'Register'}</h2>
//       {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//         {!isLogin && (
//           <input
//             type="text"
//             placeholder="Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             required
//           />
//         )}
//         <input
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           required
//           minLength={6}
//         />
//         {!isLogin && (
//           <select
//             value={form.role}
//             onChange={(e) => setForm({ ...form, role: e.target.value })}
//           >
//             <option value="staff">Staff</option>
//             <option value="manager">Manager</option>
//             <option value="admin">Admin</option>
//           </select>
//         )}
//         <button type="submit" disabled={loading}>
//           {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
//         </button>
//         <button
//           type="button"
//           onClick={() => {
//             setIsLogin(!isLogin);
//             setError('');
//           }}
//           style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0066cc' }}
//         >
//           {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
//         </button>
//       </form>
//     </div>
//   );
// }

