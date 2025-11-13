import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from 'react';
import axios from 'axios';

// --- 1. API Client (from api/client.js) ---
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. Auth Context (from context/AuthContext.jsx) ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false); // Changed from true to false

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // In a real app, you'd verify the token with the backend
      // For this demo, we'll assume the token is valid if it exists
      // Let's try to decode it (simple decode, not verification)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.email, name: payload.name });
      } catch (e) {
        console.error('Failed to decode token, logging out.');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
      setLoading(false);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };
  
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.error || error.message);
      setLoading(false);
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// --- 3. Protected Route (from components/ProtectedRoute.jsx) ---
// We will implement this as a component that wraps children
const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuth();
  
  if (!user && !token) {
    // If no user, redirect to login by rendering the Login page
    // We pass a special prop to indicate it's a redirect
    return <Login redirect={true} />;
  }

  return children;
};

// --- 4. Main App Component (from App.jsx and main.jsx) ---
// This will handle routing using state
export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

// --- Simple State-Based Router ---
const Router = () => {
  const { user } = useAuth();
  // We use hash for navigation to avoid server reloads
  const [page, setPage] = useState(window.location.hash || '#login');
  
  const handleNav = (targetPage) => {
    window.location.hash = targetPage;
    setPage(targetPage);
  };

  useEffect(() => {
    const handleHashChange = () => {
      setPage(window.location.hash || (user ? '#dashboard' : '#login'));
    };
    
    // Set initial page
    if (!user && page !== '#register') {
      handleNav('#login');
    } else if (user && (page === '#login' || page === '#register' || page === '')) {
      handleNav('#dashboard');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]); // Re-evaluate when user logs in or out

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

// --- 5. Login Page (from pages/Login.jsx) ---
const Login = ({ onNavigate, redirect = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      onNavigate('#dashboard'); // Navigate on successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {redirect && (
          <div className="p-3 text-center text-yellow-800 bg-yellow-100 rounded-md">
            You must be logged in to view that page.
          </div>
        )}
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Inventory Login
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </button>
          </div>
          <p className="text-sm text-center">
            No account?{' '}
            <a
              href="#register"
              onClick={(e) => { e.preventDefault(); onNavigate('#register'); }}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

// --- 6. Register Page (New) ---
const Register = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if(password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    try {
      await register(name, email, password);
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => onNavigate('#login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Create Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          {success && <p className="text-sm text-center text-green-600">{success}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <p className="text-sm text-center">
            Already have an account?{' '}
            <a
              href="#login"
              onClick={(e) => { e.preventDefault(); onNavigate('#login'); }}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

// --- 7. Sidebar/Layout (for protected pages) ---
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
      {/* Sidebar */}
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

      {/* Main Content */}
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

// --- 8. Dashboard Page (from pages/Dashboard.jsx) ---
const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({ products: 0, orders: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [productsRes, ordersRes, reportsRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
          api.get('/reports/low-stock'),
        ]);
        
        const lowStockItems = reportsRes.data.filter(p => p.quantity < 10).length;

        setStats({
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          lowStock: lowStockItems,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <Layout onNavigate={onNavigate} title="Dashboard">
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard title="Total Products" value={stats.products} />
          <StatCard title="Total Orders" value={stats.orders} />
          <StatCard title="Low Stock Items" value={stats.lowStock} color="bg-red-500" />
        </div>
      )}
    </Layout>
  );
};

const StatCard = ({ title, value, color = 'bg-blue-500' }) => (
  <div className={`p-6 text-white ${color} rounded-lg shadow-md`}>
    <div className="text-sm font-medium uppercase">{title}</div>
    <div className="mt-2 text-3xl font-bold">{value}</div>
  </div>
);


// --- 9. Products Page (from pages/Products.jsx) ---
const Products = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (product) => {
    try {
      if (editingProduct) {
        // Update
        await api.put(`/products/${editingProduct.id}`, product);
      } else {
        // Create
        await api.post('/products', product);
      }
      setShowModal(false);
      setEditingProduct(null);
      fetchProducts(); // Refetch
    } catch (err) {
      console.error('Failed to save product', err);
      setError('Failed to save product. Check console for details.');
    }
  };

  const handleDelete = async (id) => {
    // Custom confirm modal
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(); // Refetch
      } catch (err) {
        console.error('Failed to delete product', err);
        setError('Failed to delete product.');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };
  
  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  return (
    <Layout onNavigate={onNavigate} title="Products">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddNew}
          className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 text-sm text-blue-600 rounded-md hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 ml-2 text-sm text-red-600 rounded-md hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </Layout>
  );
};


// --- 10. Product Form Modal (from components/ProductForm.jsx) ---
const ProductForm = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    price: product?.price || 0,
    quantity: product?.quantity || 0,
    category: product?.category || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <h3 className="mb-4 text-xl font-semibold">
          {product ? 'Edit Product' : 'Add Product'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- 11. Orders Page (from pages/Orders.jsx) ---
const Orders = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Use a map for quick product lookup by ID
  const productMap = useRef(new Map());

  const fetchOrdersAndProducts = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      // Update product map
      productMap.current.clear();
      productsRes.data.forEach(p => productMap.current.set(p.id, p));
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrdersAndProducts();
  }, []);

  const handleSaveOrder = async (orderData) => {
    try {
      await api.post('/orders', orderData);
      setShowModal(false);
      fetchOrdersAndProducts(); // Refetch
    } catch (err) {
      console.error('Failed to create order', err);
      setError(err.response?.data?.error || 'Failed to create order. Insufficient stock?');
    }
  };

  const getProductName = (id) => {
    return productMap.current.get(id)?.name || 'Unknown Product';
  };

  return (
    <Layout onNavigate={onNavigate} title="Orders">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
        >
          Create New Order
        </button>
      </div>

      {error && <p className="mb-4 text-red-600" onClick={() => setError('')}>{error} (click to dismiss)</p>}

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 && <p>No orders found.</p>}
          {orders.map((order) => (
            <div key={order.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">Order ID: {order.id}</h3>
                <span className="font-bold text-green-600">${order.totalValue.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
              <div className="mt-2">
                <h4 className="text-sm font-medium">Items:</h4>
                <ul className="pl-4 list-disc list-inside">
                  {order.items.slice(0, order.itemCount).map((item, index) => (
                    <li key={index} className="text-sm">
                      {item.quantity} x {getProductName(item.productId)} (@ ${item.pricePerItem.toFixed(2)} each)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <OrderForm
          products={products}
          onSave={handleSaveOrder}
          onClose={() => setShowModal(false)}
        />
      )}
    </Layout>
  );
};

// --- 12. New Order Form Modal ---
const OrderForm = ({ products, onSave, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // If changing product, reset quantity
    if(field === 'productId' && value !== '') {
       newItems[index]['quantity'] = 1;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };
  
  const getProductStock = (productId) => {
    if (!productId) return 0;
    const product = products.find(p => p.id === parseInt(productId));
    return product?.quantity || 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedItems = items
      .filter(item => item.productId && item.quantity > 0)
      .map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
      }));
    
    if(formattedItems.length === 0) {
      alert("Please add at least one valid item.");
      return;
    }
      
    onSave({ customerName, items: formattedItems });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="mb-4 text-xl font-semibold">Create Order</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <h4 className="text-lg font-medium">Items</h4>
          {items.map((item, index) => (
            <div key={index} className="flex items-end space-x-2">
              <div className="flex-1">
                <label className="block text-sm font-medium">Product</label>
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                >
                  <option value="">Select a product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                      {p.name} (Stock: {p.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={getProductStock(item.productId)}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                  disabled={!item.productId}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="px-3 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            Add Another Item
          </button>
          
          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- 13. Reports Page (from pages/Reports.jsx) ---
const Reports = ({ onNavigate }) => {
  const [lowStock, setLowStock] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ by: 'name', order: 'asc' });
  const [loadingLowStock, setLoadingLowStock] = useState(true);
  const [loadingSorted, setLoadingSorted] = useState(true);

  const fetchLowStock = async () => {
    setLoadingLowStock(true);
    try {
      const res = await api.get('/reports/low-stock');
      // C++ heap returns all items, sorted by stock asc
      setLowStock(res.data.filter(p => p.quantity < 20)); // Filter for display
    } catch (err) {
      console.error('Failed to fetch low stock report', err);
    }
    setLoadingLowStock(false);
  };
  
  const fetchSortedProducts = async () => {
    setLoadingSorted(true);
    try {
      const res = await api.get(`/reports/sorted-products?by=${sortConfig.by}&order=${sortConfig.order}`);
      setSortedProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch sorted products', err);
    }
    setLoadingSorted(false);
  };

  useEffect(() => {
    fetchLowStock();
  }, []);
  
  useEffect(() => {
    fetchSortedProducts();
  }, [sortConfig]);
  
  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setSortConfig(prev => ({...prev, [name]: value}));
  };

  return (
    <Layout onNavigate={onNavigate} title="Reports">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low Stock Report */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-xl font-semibold">Low Stock Report (DSA: Min-Heap)</h3>
          {loadingLowStock ? <p>Loading...</p> : (
            <div className="overflow-y-auto max-h-96">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lowStock.map(p => (
                    <tr key={p.id}>
                      <td className="px-4 py-2">{p.name} ({p.sku})</td>
                      <td className="px-4 py-2 font-bold text-red-600">{p.quantity}</td>
                    </tr>
                  ))}
                  {lowStock.length === 0 && (
                    <tr><td colSpan="2" className="px-4 py-2 text-center text-gray-500">No items with low stock.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Sorted Products Report */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-xl font-semibold">Sorted Product List (DSA: Sort)</h3>
          <div className="flex space-x-2 mb-4">
            <select name="by" value={sortConfig.by} onChange={handleSortChange} className="p-2 border border-gray-300 rounded-md">
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="quantity">Sort by Quantity</option>
            </select>
            <select name="order" value={sortConfig.order} onChange={handleSortChange} className="p-2 border border-gray-300 rounded-md">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          
          {loadingSorted ? <p>Loading...</p> : (
            <div className="overflow-y-auto max-h-96">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedProducts.map(p => (
                    <tr key={p.id}>
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">${p.price.toFixed(2)}</td>
                      <td className="px-4 py-2">{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};