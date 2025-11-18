import { useState } from 'react';
import { Package, Lock, Mail, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
      // prefer onNavigate if provided, otherwise set hash
      if (onNavigate) onNavigate('#dashboard');
      else window.location.hash = '#dashboard';
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8 flex items-center space-x-3">
            <div className="p-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">InventoryPro</h1>
              <p className="text-blue-200 text-sm">Smart Management System</p>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Manage Your<br />
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Inventory Smarter
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-md">
            Real-time tracking, analytics, and automation for modern businesses
          </p>
          
          <div className="space-y-4">
            {[
              { icon: TrendingUp, text: 'Real-time Analytics' },
              { icon: Package, text: 'Smart Stock Management' },
              { icon: Lock, text: 'Enterprise Security' }
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-blue-100">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">InventoryPro</h1>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
            {redirect && (
              <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
                <p className="text-yellow-100 text-sm text-center font-medium">
                  You must be logged in to view that page.
                </p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-blue-200">
                Sign in to access your dashboard
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-blue-200 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  Remember me
                </label>
                {/* <a href="#" className="text-blue-300 hover:text-blue-200 font-medium transition-colors">
                  Forgot password?
                </a> */}
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full group relative py-3.5 px-6 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="flex items-center justify-center">
                  {loading ? 'Signing in...' : 'Sign In'}
                  {!loading && (
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                {/* <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900/50 text-blue-200 backdrop-blur-sm">
                    or continue with
                  </span>
                </div> */}
              </div>

              {/* <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div> */}

              <p className="text-center text-sm text-blue-200">
                Don't have an account?{' '}
                <a
                  href="#register"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('#register');
                  }}
                  className="font-semibold text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Create Account
                </a>
              </p>
            </div>
          </div>

          {/* <p className="mt-6 text-center text-xs text-blue-300/60">
            Protected by enterprise-grade security
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;