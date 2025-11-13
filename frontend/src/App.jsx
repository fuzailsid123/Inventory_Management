// import React from 'react';
// import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
// import { useAuth } from './context/AuthContext.jsx';
// import { logout } from './api/client.js';
// import ProtectedRoute from './components/ProtectedRoute.jsx';
// import Login from './pages/Login.jsx';
// import Dashboard from './pages/Dashboard.jsx';
// import Products from './pages/Products.jsx';
// import Orders from './pages/Orders.jsx';
// import Reports from './pages/Reports.jsx';

// function Layout({ children }) {
//   const { user, logout: handleLogout } = useAuth();
//   const location = useLocation();

//   const handleLogoutClick = () => {
//     logout();
//     handleLogout();
//   };

//   const navItems = [
//     { path: '/', label: 'Dashboard' },
//     { path: '/products', label: 'Products' },
//     { path: '/orders', label: 'Orders' },
//     { path: '/reports', label: 'Reports' },
//   ];

//   return (
//     <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <header style={{ background: '#0066cc', color: 'white', padding: '16px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1400, margin: '0 auto' }}>
//           <h1 style={{ margin: 0, fontSize: '24px' }}>Inventory Management System</h1>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//             <span style={{ fontSize: '14px' }}>{user?.name} ({user?.role})</span>
//             <button onClick={handleLogoutClick} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>
//       <nav style={{ background: 'white', borderBottom: '1px solid #ddd', padding: '0 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//         <div style={{ display: 'flex', gap: 8, maxWidth: 1400, margin: '0 auto' }}>
//           {navItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               style={{
//                 padding: '12px 16px',
//                 textDecoration: 'none',
//                 color: location.pathname === item.path ? '#0066cc' : '#666',
//                 borderBottom: location.pathname === item.path ? '2px solid #0066cc' : '2px solid transparent',
//                 fontWeight: location.pathname === item.path ? '600' : '400',
//               }}
//             >
//               {item.label}
//             </Link>
//           ))}
//         </div>
//       </nav>
//       <main style={{ flex: 1, padding: '24px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
//         {children}
//       </main>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route
//         path="/*"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <Routes>
//                 <Route path="/" element={<Dashboard />} />
//                 <Route path="/products" element={<Products />} />
//                 <Route path="/orders" element={<Orders />} />
//                 <Route path="/reports" element={<Reports />} />
//                 <Route path="*" element={<Navigate to="/" replace />} />
//               </Routes>
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// }


import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Fragment,
} from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

// +-----------------------+
// | STYLES (from index.css) |
// +-----------------------+

function GlobalStyles() {
  return (
    <style>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #f5f5f5;
        color: #333;
      }

      code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
          monospace;
      }

      button,
      .button {
        padding: 8px 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-block;
        color: #333;
      }
      
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      button:hover,
      .button:hover {
        background: #f0f0f0;
        border-color: #999;
      }

      button:active,
      .button:active {
        background: #e0e0e0;
      }

      button.primary,
      .button.primary {
        background: #0066cc;
        color: white;
        border-color: #0066cc;
      }

      button.primary:hover,
      .button.primary:hover {
        background: #0052a3;
      }

      button.danger,
      .button.danger {
        background: #dc3545;
        color: white;
        border-color: #dc3545;
      }

      button.danger:hover,
      .button.danger:hover {
        background: #c82333;
      }

      input, select, textarea {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        width: 100%;
        font-family: inherit;
      }

      input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }

      th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #eee;
      }

      th {
        background: #f8f9fa;
        font-weight: 600;
        color: #333;
      }

      tr:hover {
        background: #f8f9fa;
      }

      .card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 20px;
      }

      .grid {
        display: grid;
        gap: 20px;
      }

      .grid-2 {
        grid-template-columns: repeat(2, 1fr);
      }

      .grid-3 {
        grid-template-columns: repeat(3, 1fr);
      }

      .grid-4 {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (max-width: 768px) {
        .grid-2, .grid-3, .grid-4 {
          grid-template-columns: 1fr;
        }
      }

      .badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      .badge.success {
        background: #d4edda;
        color: #155724;
      }

      .badge.warning {
        background: #fff3cd;
        color: #856404;
      }

      .badge.danger {
        background: #f8d7da;
        color: #721c24;
      }

      .badge.info {
        background: #d1ecf1;
        color: #0c5460;
      }
    `}</style>
  );
}

// +-----------------------+
// | API CLIENT (client.js)  |
// +-----------------------+

const BASE = ''; // Assumes proxy or same-domain deployment

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use a custom event or other mechanism to notify context
      // For simplicity, we'll let the next API call fail or ProtectedRoute catch it
      // A hard redirect can be disruptive
      console.error('Unauthorized, logging out.');
      window.location.href = '/login';
    }
    throw new Error(data.message || data.error || `Request failed with status ${res.status}`);
  }
  // The backend responses are wrapped in { success, data, pagination } or { success, data, message }
  // We return the core data payload
  return data.data || data;
}

export async function apiGet(path, requireAuth = true) {
  const res = await fetch(`${BASE}${path}`, {
    headers: getHeaders(requireAuth),
  });
  return handleResponse(res);
}

export async function apiPost(path, body, requireAuth = true) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: getHeaders(requireAuth),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiPut(path, body, requireAuth = true) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: getHeaders(requireAuth),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiPatch(path, body, requireAuth = true) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: getHeaders(requireAuth),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiDelete(path, requireAuth = true) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: getHeaders(requireAuth),
  });
  return handleResponse(res);
}

// Auth specific functions
export async function login(email, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  // Auth responses have a different structure
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  if (data.data && data.data.accessToken) {
    localStorage.setItem('token', data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data.data || data;
}

export async function register(userData) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  // Register returns the created user, not tokens
  return data.data || data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
  return !!getToken();
}

// +-----------------------+
// | AUTH CONTEXT          |
// +-----------------------+

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }
    setLoading(false);
  }, []);

  const loginAuth = (userData) => {
    // userData from the API login response
    setUser(userData.user);
  };

  const logoutAuth = () => {
    logout(); // Clear localStorage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: loginAuth, logout: logoutAuth, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// +-----------------------+
// | PROTECTED ROUTE       |
// +-----------------------+

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// +-----------------------+
// | COMPONENT: ProductForm|
// +-----------------------+

function ProductForm({ initial, categories = [], onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    barcode: '',
    description: '',
    category: '',
    supplier: '',
    quantity: 0,
    reorderLevel: 0,
    reorderQuantity: 0,
    maxStock: 0,
    turnoverRate: 0,
    costPrice: 0,
    sellingPrice: 0,
    unit: 'piece',
    isActive: true,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        sku: initial.sku || '',
        barcode: initial.barcode || '',
        description: initial.description || '',
        // Handle populated vs non-populated IDs
        category: initial.category?._id || initial.category || '',
        supplier: initial.supplier?._id || initial.supplier || '',
        quantity: initial.quantity || 0,
        reorderLevel: initial.reorderLevel || 0,
        reorderQuantity: initial.reorderQuantity || 0,
        maxStock: initial.maxStock || 0,
        turnoverRate: initial.turnoverRate || 0,
        costPrice: initial.costPrice || 0,
        sellingPrice: initial.sellingPrice || 0,
        unit: initial.unit || 'piece',
        isActive: initial.isActive !== undefined ? initial.isActive : true,
      });
    } else {
      // Reset form if initial is null (e.g., switching from edit to add)
       setForm({
        name: '', sku: '', barcode: '', description: '', category: '',
        supplier: '', quantity: 0, reorderLevel: 0, reorderQuantity: 0,
        maxStock: 0, turnoverRate: 0, costPrice: 0, sellingPrice: 0,
        unit: 'piece', isActive: true,
      });
    }
  }, [initial]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  }

  function submit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
      <h3 style={{ marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
        {initial ? 'Edit Product' : 'Add New Product'}
      </h3>
      
      <div className="grid grid-2">
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Product Name *
          </label>
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            SKU *
          </label>
          <input
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            required
            style={{ textTransform: 'uppercase' }}
            disabled={!!initial} // Don't allow SKU edit
          />
        </div>
      </div>

      <div className="grid grid-2">
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Barcode
          </label>
          <input
            name="barcode"
            placeholder="Barcode"
            value={form.barcode}
            onChange={handleChange}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Unit
          </label>
          <select name="unit" value={form.unit} onChange={handleChange}>
            <option value="piece">Piece</option>
            <option value="kg">Kilogram</option>
            <option value="liter">Liter</option>
            <option value="box">Box</option>
            <option value="pack">Pack</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
          Description
        </label>
        <textarea
          name="description"
          placeholder="Product description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="grid grid-2">
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Category ID
          </label>
          <input
            name="category"
            placeholder="Category ID"
            value={form.category}
            onChange={handleChange}
            list="categories"
          />
          {/* Using datalist for simple suggestions based on existing categories */}
          <datalist id="categories">
            {categories.map(cat => <option key={cat} value={cat} />)}
          </datalist>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Supplier ID
          </label>
          <input
            name="supplier"
            placeholder="Supplier ID"
            value={form.supplier}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-3">
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Quantity *
          </label>
          <input
            name="quantity"
            type="number"
            step="0.01"
            placeholder="0"
            value={form.quantity}
            onChange={handleChange}
            required
            min="0"
            disabled={!!initial} // Initial stock set on creation, updated via stock mgmt
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Reorder Level *
          </label>
          <input
            name="reorderLevel"
            type="number"
            step="0.01"
            placeholder="0"
            value={form.reorderLevel}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Max Stock
          </label>
          <input
            name="maxStock"
            type="number"
            step="0.01"
            placeholder="0"
            value={form.maxStock}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-3">
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Cost Price
          </label>
          <input
            name="costPrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.costPrice}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Selling Price
          </label>
          <input
            name="sellingPrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.sellingPrice}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
            Turnover Rate
          </label>
          <input
            name="turnoverRate"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.turnoverRate}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          <span>Product is active</span>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: 16 }}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary">Save Product</button>
      </div>
    </form>
  );
}

// +-----------------------+
// | PAGE: Login           |
// +-----------------------+

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setAuth, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(form.email, form.password);
        setAuth(result);
      } else {
        await register(form);
        // After register, force them to login
        alert('Registration successful! Please log in.');
        setIsLogin(true);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 400, width: '100%', margin: '50px auto', padding: 32, border: '1px solid #ddd', borderRadius: 8, background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{isLogin ? 'Login' : 'Register'}</h2>
        {error && <div style={{ color: 'red', marginBottom: 16, background: '#f8d7da', padding: 12, borderRadius: 4 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          {!isLogin && (
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button type="submit" disabled={loading} className="primary" style={{ padding: 12, marginTop: 8 }}>
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0066cc', padding: 8 }}
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// +-----------------------+
// | PAGE: Dashboard       |
// +-----------------------+

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [reorder, setReorder] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [statsData, reorderData, expiringData] = await Promise.all([
        apiGet('/api/inventory/stats'),
        apiGet('/api/inventory/reorder-suggestions?top=10'),
        apiGet('/api/inventory/expiring-batches?daysAhead=30'),
      ]);
      setStats(statsData);
      // reorderData.data is the array
      setReorder(reorderData.data || []);
      setExpiring(expiringData.products || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      alert('Failed to load dashboard: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40 }}>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>Total Products</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066cc' }}>
            {stats?.totalProducts || 0}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>Inventory Value</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
            ${(stats?.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>Low Stock Items</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
            {stats?.lowStockCount || 0}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>Out of Stock</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
            {stats?.outOfStockCount || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Reorder Suggestions */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Top Reorder Suggestions</h3>
          {reorder.length === 0 ? (
            <p style={{ color: '#666' }}>No products need reordering</p>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current</th>
                  <th>Reorder Level</th>
                  <th>Suggestion</th>
                </tr>
              </thead>
              <tbody>
                {reorder.map((p) => (
                  <tr key={p._id || p.sku}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{p.sku}</div>
                    </td>
                    <td>
                      <span className={`badge ${p.quantity <= 0 ? 'danger' : p.quantity < p.reorderLevel ? 'warning' : 'success'}`}>
                        {p.quantity}
                      </span>
                    </td>
                    <td>{p.reorderLevel}</td>
                    <td>
                      {p._suggestion && (
                        <div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{p._suggestion.reason}</div>
                          {p._suggestion.suggestedQuantity > 0 && (
                            <div style={{ fontSize: '12px', color: '#0066cc', fontWeight: 'bold' }}>
                              Suggest: {Math.ceil(p._suggestion.suggestedQuantity)}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Expiring Batches */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Expiring Batches (Next 30 Days)</h3>
          {expiring.length === 0 ? (
            <p style={{ color: '#666' }}>No batches expiring soon</p>
          ) : (
             <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Batch</th>
                  <th>Quantity</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {expiring.map((p) => {
                  const expiringBatch = p.batches?.find(b => {
                    if (!b.expiryDate) return false;
                    const expiry = new Date(b.expiryDate).getTime();
                    const daysUntil = (expiry - Date.now()) / (1000 * 60 * 60 * 24);
                    return daysUntil > 0 && daysUntil <= 30;
                  });
                  if (!expiringBatch) return null;
                  const expiry = new Date(expiringBatch.expiryDate).getTime();
                  const daysUntil = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={`${p._id}-${expiringBatch.batchNumber}`}>
                      <td>{p.name}</td>
                      <td>{expiringBatch.batchNumber}</td>
                      <td>{expiringBatch.quantity}</td>
                      <td>
                        <span className={`badge ${daysUntil <= 7 ? 'danger' : daysUntil <= 14 ? 'warning' : 'info'}`}>
                          {daysUntil} days
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// +-----------------------+
// | PAGE: Products        |
// +-----------------------+

function Products() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); // Stores category IDs/names for filter

  // Function to load products
  const load = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (search) params.append('search', search);
      if (category) params.append('category', category); // Assumes category is an ID
      if (lowStock) params.append('lowStock', 'true');

      // apiGet returns the `data` payload, which is the full response object
      // from the backend's `paginationResponse`
      const response = await apiGet(`/api/products?${params.toString()}`);
      setItems(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('Failed to load products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to load categories
  async function loadCategories() {
    try {
      // This is a simple implementation. Ideally, you'd have a /api/categories endpoint
      const catsResponse = await apiGet('/api/products?limit=1000');
      const uniqueCats = new Map();
      (catsResponse.data || []).forEach(p => {
        if(p.category && p.category._id && p.category.name) {
          uniqueCats.set(p.category._id, p.category.name);
        } else if (p.category) {
           uniqueCats.set(p.category, p.category); // Fallback if not populated
        }
      });
      setCategories(Array.from(uniqueCats, ([id, name]) => ({ id, name })));
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    load();
  }, [pagination.page, search, category, lowStock]);

  async function onSave(form) {
    try {
      if (editing) {
        // Don't send quantity on update, it's handled by stock endpoint
        const { quantity, ...updateData } = form;
        await apiPut(`/api/products/${editing._id}`, updateData);
      } else {
        await apiPost('/api/products', form);
      }
      setShowForm(false);
      setEditing(null);
      await load(); // Refresh list
    } catch (error) {
      alert(error.message || 'Failed to save product');
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      await apiDelete(`/api/products/${id}`);
      await load(); // Refresh list
    } catch (error)
    {
      alert(error.message || 'Failed to delete product');
    }
  }
  
  // Simple stock adjustment modal
  async function adjustStock(product) {
    const reason = prompt(`Adjust stock for ${product.name} (Current: ${product.quantity})\n\nEnter reason:`, "Manual adjustment");
    if (!reason) return;
    
    const qtyStr = prompt("Enter quantity to add (e.g., 10) or remove (e.g., -5):");
    if (!qtyStr) return;
    
    const quantity = parseFloat(qtyStr);
    if (isNaN(quantity) || quantity === 0) {
      return alert("Invalid quantity.");
    }
    
    const type = quantity > 0 ? 'in' : 'out';
    
    try {
      // The backend expects a warehouse. We need to ask the user or pick the first one.
      // For simplicity, we'll assume the product has a primary warehouse or ask.
      // This is a simplification; the backend `updateStock` requires a warehouse ID.
      // We will skip this for now as it requires more UI.
      
      // Let's use the patch endpoint from product.controller.js
      // It requires: { quantity, warehouse, type, reason }
      // This frontend doesn't manage warehouses, so this will fail.
      // We must simplify or add a warehouse selector.
      
      // Let's assume the user just wants to update the *total* quantity
      // The current backend `updateStock` requires a warehouse.
      // This is a mismatch.
      
      // We will *not* implement this button, as the backend API
      // (`PATCH /api/products/:id/stock`) requires a warehouse ID,
      // and the frontend data model doesn't seem to track it.
      
      alert(`Stock adjustment UI not fully implemented.\nBackend requires a warehouse ID to adjust stock.`);
      
      // ---- CODE THAT WOULD RUN IF WAREHOUSE WAS KNOWN ----
      // const warehouseId = "SOME_WAREHOUSE_ID"; // This is the missing piece
      // await apiPatch(`/api/products/${product._id}/stock`, {
      //   quantity: Math.abs(quantity),
      //   type,
      //   reason,
      //   warehouse: warehouseId 
      // });
      // await load();
      // ----------------------------------------------------
      
    } catch (error) {
       alert(error.message || 'Failed to update stock');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Products</h2>
        <button className="primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Search</label>
            <input
              placeholder="Search name/SKU/barcode"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Category</label>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div style={{ paddingTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={lowStock}
                onChange={(e) => { setLowStock(e.target.checked); setPagination(prev => ({ ...prev, page: 1 })); }}
              />
              Low Stock Only
            </label>
          </div>
          <button onClick={load} disabled={loading}>Refresh</button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <ProductForm
            initial={editing}
            categories={categories.map(c => c.name)} // Pass names for datalist
            onSave={onSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading products...</div>
      ) : (
        <>
          <div className="card" style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Reorder Level</th>
                  <th>Cost Price</th>
                  <th>Selling Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                      No products found
                    </td>
                  </tr>
                ) : (
                  items.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        {p.barcode && <div style={{ fontSize: '12px', color: '#666' }}>Barcode: {p.barcode}</div>}
                      </td>
                      <td>{p.sku}</td>
                      <td>{p.category?.name || p.category || '-'}</td>
                      <td>
                        <span className={`badge ${p.quantity <= 0 ? 'danger' : p.quantity < p.reorderLevel ? 'warning' : 'success'}`}>
                          {p.quantity}
                        </span>
                      </td>
                      <td>{p.reorderLevel}</td>
                      <td>${p.costPrice?.toFixed(2) || '0.00'}</td>
                      <td>${p.sellingPrice?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={`badge ${p.isActive ? 'success' : 'danger'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => { setEditing(p); setShowForm(true); }} style={{ fontSize: '12px', padding: '4px 8px' }}>
                            Edit
                          </button>
                           {/*<button onClick={() => adjustStock(p)} style={{ fontSize: '12px', padding: '4px 8px' }}>
                            Stock
                          </button>*/}
                          <button
                            className="danger"
                            onClick={() => onDelete(p._id)}
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrev}
              >
                Previous
              </button>
              <span style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNext}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// +-----------------------+
// | PAGE: Orders          |
// +-----------------------+

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false });
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const initialFormState = {
    type: 'sale',
    items: [{ product: '', quantity: 1, unitPrice: 0 }],
    customer: { name: '', email: '', phone: '' },
    paymentMethod: 'cash',
    notes: '',
    warehouse: '', // Warehouse is required for stock movements
    supplier: '', // For purchase orders
  };
  const [form, setForm] = useState(initialFormState);

  // Function to load orders
  const load = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (status) params.append('status', status);
      if (type) params.append('type', type);

      const response = await apiGet(`/api/orders?${params.toString()}`);
      setOrders(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      alert('Failed to load orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to load products (for the order form)
  async function loadProducts() {
    try {
      const data = await apiGet('/api/products?limit=1000&isActive=true');
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }

  useEffect(() => {
    loadProducts();
    // We don't load orders here, let the second effect do it
  }, []);
  
  useEffect(() => {
    load();
  }, [pagination.page, status, type]);

  function addItem() {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, unitPrice: 0 }],
    }));
  }

  function removeItem(index) {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function updateItem(index, field, value) {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }
  
  function handleFormChange(e) {
     const { name, value } = e.target;
     setForm(prev => ({ ...prev, [name]: value }));
  }

  function updateProductPrice(index) {
    const productId = form.items[index].product;
    const product = products.find(p => p._id === productId);
    if (product) {
      const price = form.type === 'purchase' ? product.costPrice : product.sellingPrice;
      updateItem(index, 'unitPrice', price || 0);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const orderData = {
        ...form,
        items: form.items
          .filter(item => item.product && item.quantity > 0)
          .map(item => ({
            product: item.product,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
          })),
      };
      
      // Backend controller requires a warehouse for sales orders to check stock
      // and for all orders to update stock.
      if (!orderData.warehouse) {
        alert("Please select a warehouse.");
        return;
      }
      
      if (orderData.type === 'purchase' && !orderData.supplier) {
         alert("Please select a supplier for purchase orders.");
        return;
      }
      
      await apiPost('/api/orders', orderData);
      setShowForm(false);
      setForm(initialFormState);
      await load();
    } catch (error) {
      alert(error.message || 'Failed to create order');
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      // The backend will handle stock updates when status changes to 'completed'
      await apiPut(`/api/orders/${orderId}`, { status: newStatus });
      await load();
    } catch (error) {
      alert(error.message || 'Failed to update order');
    }
  }

  const calculateTotal = () => {
    return form.items.reduce((sum, item) => {
      const price = item.unitPrice || 0;
      const qty = item.quantity || 0;
      return sum + (price * qty);
    }, 0);
  };
  
  // These should be fetched from /api/warehouses and /api/suppliers
  // Hardcoding for now as those endpoints don't exist in the provided backend
  const warehouses = [{_id: "60d5f1b3e6b3f1b3e4b3f1b3", name: "Main Warehouse"}];
  const suppliers = [{_id: "60d5f1b3e6b3f1b3e4b3f1b4", name: "Main Supplier"}];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Orders</h2>
        <button className="primary" onClick={() => setShowForm(true)}>
          Create Order
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Status</label>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Type</label>
            <select value={type} onChange={(e) => { setType(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
              <option value="">All Types</option>
              <option value="sale">Sale</option>
              <option value="purchase">Purchase</option>
              <option value="transfer">Transfer</option>
              <option value="return">Return</option>
            </select>
          </div>
          <button onClick={load} disabled={loading}>Refresh</button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Create New Order</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-3" style={{ marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
                  Order Type *
                </label>
                <select name="type" value={form.type} onChange={handleFormChange}>
                  <option value="sale">Sale</option>
                  <option value="purchase">Purchase</option>
                  <option value="transfer">Transfer</option>
                  <option value="return">Return</option>
                </select>
              </div>
               <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
                  Warehouse *
                </label>
                <select name="warehouse" value={form.warehouse} onChange={handleFormChange} required>
                  <option value="">Select Warehouse</option>
                  {/* These should be fetched from an API */}
                  <option value="60d5f1b3e6b3f1b3e4b3f1b3">Main Warehouse</option>
                </select>
              </div>
              {form.type === 'purchase' && (
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
                    Supplier *
                  </label>
                  <select name="supplier" value={form.supplier} onChange={handleFormChange} required>
                    <option value="">Select Supplier</option>
                    {/* These should be fetched from an API */}
                    <option value="60d5f1b3e6b3f1b3e4b3f1b4">Main Supplier</option>
                  </select>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: '14px', fontWeight: 600 }}>Items</label>
                <button type="button" onClick={addItem} style={{ fontSize: '12px', padding: '4px 8px' }}>
                  Add Item
                </button>
              </div>
              {form.items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                  <select
                    value={item.product}
                    onChange={(e) => {
                      updateItem(index, 'product', e.target.value);
                      setTimeout(() => updateProductPrice(index), 0); // Update price after state sets
                    }}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.sku}) - Stock: {p.quantity}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => removeItem(index)} className="danger" style={{ fontSize: '12px', padding: '4px 8px' }}>
                    X
                  </button>
                </div>
              ))}
              <div style={{ marginTop: 8, fontWeight: 600, textAlign: 'right', fontSize: '16px' }}>
                Total: ${calculateTotal().toFixed(2)}
              </div>
            </div>

            {form.type === 'sale' && (
              <div className="grid grid-3" style={{ marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Customer Name</label>
                  <input
                    value={form.customer.name}
                    onChange={(e) => setForm(prev => ({ ...prev, customer: { ...prev.customer, name: e.target.value } }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Email</label>
                  <input
                    type="email"
                    value={form.customer.email}
                    onChange={(e) => setForm(prev => ({ ...prev, customer: { ...prev.customer, email: e.target.value } }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Phone</label>
                  <input
                    value={form.customer.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, customer: { ...prev.customer, phone: e.target.value } }))}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-2" style={{ marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleFormChange}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit">Credit</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Notes</label>
                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  placeholder="Order notes"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: 16 }}>
              <button type="button" onClick={() => { setShowForm(false); setForm(initialFormState); }}>
                Cancel
              </button>
              <button type="submit" className="primary">Create Order</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading orders...</div>
      ) : (
        <>
          <div className="card" style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id}>
                      <td>{order.orderNumber}</td>
                      <td>
                        <span className={`badge ${order.type === 'sale' ? 'success' : order.type === 'purchase' ? 'info' : 'warning'}`}>
                          {order.type}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{order.items?.length || 0} items</td>
                      <td>${order.total?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={`badge ${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                          {order.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => alert(`View details for ${order.orderNumber}\n(Not implemented)`)} style={{ fontSize: '12px', padding: '4px 8px' }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))} disabled={!pagination.hasPrev}>
                Previous
              </button>
              <span style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))} disabled={!pagination.hasNext}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// +-----------------------+
// | PAGE: Reports         |
// +-----------------------+

function Reports() {
  const [abcAnalysis, setAbcAnalysis] = useState(null);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [expiringBatches, setExpiringBatches] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);
      const [abc, stats, expiring, lowStockData] = await Promise.all([
        apiGet('/api/inventory/abc-analysis'),
        apiGet('/api/inventory/stats'),
        apiGet('/api/inventory/expiring-batches?daysAhead=30'),
        apiGet('/api/inventory/low-stock?limit=50'),
      ]);
      setAbcAnalysis(abc);
      setInventoryStats(stats);
      setExpiringBatches(expiring.products || []);
      setLowStock(lowStockData.products || []);
    } catch (error) {
      console.error('Failed to load reports:', error);
      alert('Failed to load reports: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40 }}>Loading reports...</div>;
  }
  
  const renderAbcTable = (products = []) => (
    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {products.slice(0, 20).map((p) => (
            <tr key={p._id}>
              <td>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>{p.sku}</div>
              </td>
              <td>${((p.quantity || 0) * (p.costPrice || 0)).toFixed(2)}</td>
            </tr>
          ))}
          {products.length > 20 && (
             <tr><td colSpan="2" style={{textAlign: 'center', fontSize: '12px', color: '#666'}}>...and {products.length - 20} more</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Reports & Analytics</h2>

      {/* Inventory Statistics */}
      {inventoryStats && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Inventory Statistics</h3>
          <div className="grid grid-4">
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>Total Products</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{inventoryStats.totalProducts || 0}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>Total Value</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                ${(inventoryStats.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>Low Stock Value</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                ${(inventoryStats.lowStockValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>Low Stock Count</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                {inventoryStats.lowStockCount || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABC Analysis */}
      {abcAnalysis && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>ABC Analysis (Top 20 each)</h3>
          <p style={{ color: '#666', marginBottom: 16, fontSize: '14px' }}>
            Products categorized by inventory value: Category A (80% of value), Category B (15% of value), Category C (5% of value)
          </p>
          <div className="grid grid-3">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 style={{ margin: 0, color: '#28a745' }}>Category A</h4>
                <span className="badge success">{abcAnalysis.A?.length || 0} products</span>
              </div>
              {renderAbcTable(abcAnalysis.A)}
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 style={{ margin: 0, color: '#ffc107' }}>Category B</h4>
                <span className="badge warning">{abcAnalysis.B?.length || 0} products</span>
              </div>
              {renderAbcTable(abcAnalysis.B)}
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 style={{ margin: 0, color: '#6c757d' }}>Category C</h4>
                <span className="badge info">{abcAnalysis.C?.length || 0} products</span>
              </div>
               {renderAbcTable(abcAnalysis.C)}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-2">
        {/* Low Stock Products */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Low Stock Products</h3>
          {lowStock.length === 0 ? (
            <p style={{ color: '#666' }}>No low stock products</p>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Reorder Level</th>
                    <th>Deficit</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((p) => {
                    const deficit = (p.reorderLevel || 0) - (p.quantity || 0);
                    return (
                      <tr key={p._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{p.sku}</div>
                        </td>
                        <td>
                          <span className={`badge ${p.quantity <= 0 ? 'danger' : 'warning'}`}>
                            {p.quantity}
                          </span>
                        </td>
                        <td>{p.reorderLevel}</td>
                        <td>
                          <span className="badge danger">{deficit}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Expiring Batches */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Expiring Batches (Next 30 Days)</h3>
          {expiringBatches.length === 0 ? (
            <p style={{ color: '#666' }}>No batches expiring soon</p>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Batch</th>
                    <th>Quantity</th>
                    <th>Days Until Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringBatches.map((p) => {
                    const expiringBatch = p.batches?.find(b => {
                      if (!b.expiryDate) return false;
                      const expiry = new Date(b.expiryDate).getTime();
                      const daysUntil = (expiry - Date.now()) / (1000 * 60 * 60 * 24);
                      return daysUntil > 0 && daysUntil <= 30;
                    });
                    if (!expiringBatch) return null;
                    const expiry = new Date(expiringBatch.expiryDate).getTime();
                    const daysUntil = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24));
                    return (
                      <tr key={`${p._id}-${expiringBatch.batchNumber}`}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{p.sku}</div>
                        </td>
                        <td>{expiringBatch.batchNumber}</td>
                        <td>{expiringBatch.quantity}</td>
                        <td>
                          <span className={`badge ${daysUntil <= 7 ? 'danger' : daysUntil <= 14 ? 'warning' : 'info'}`}>
                            {daysUntil} days
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// +-----------------------+
// | APP & LAYOUT          |
// +-----------------------+

function Layout({ children }) {
  const { user, logout: handleLogout } = useAuth();
  const location = useLocation();

  const handleLogoutClick = () => {
    handleLogout();
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/orders', label: 'Orders' },
    { path: '/reports', label: 'Reports' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#fff', color: '#333', padding: '16px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1400, margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#0066cc' }}>Inventory System</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '14px' }}>{user?.name} ({user?.role})</span>
            <button onClick={handleLogoutClick} style={{ background: 'transparent', color: '#dc3545', borderColor: '#dc3545' }}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <nav style={{ background: 'white', borderBottom: '1px solid #ddd', padding: '0 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: 8, maxWidth: 1400, margin: '0 auto' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '12px 16px',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#0066cc' : '#666',
                borderBottom: location.pathname === item.path ? '2px solid #0066cc' : '2px solid transparent',
                fontWeight: location.pathname === item.path ? '600' : '400',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main style={{ flex: 1, padding: '24px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Fragment>
      <GlobalStyles />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Fragment>
  );
}

// +-----------------------+
// | RENDERER (main.jsx)   |
// +-----------------------+

// This replaces the content of main.jsx
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// We need to default export App for the environment, but the render logic
// is what actually runs the app.
export default App;