import { useState } from 'react';
import { Package, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(name, email, password);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => onNavigate('#login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      
      {/* Left Brand Panel */}
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
            Create Your<br />
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Account Today
            </span>
          </h2>

          <p className="text-xl text-blue-100 max-w-md">
            Join the platform trusted for real-time inventory management.
          </p>
        </div>
      </div>

      {/* Right Form */}
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

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              {/* <p className="text-blue-200">
                Join us to start managing your inventory smarter.
              </p> */}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="text"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Password"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-200 text-center text-sm">{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <p className="text-green-200 text-center text-sm">{success}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative py-3.5 px-6 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 transform hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                <span className="flex items-center justify-center">
                  {loading ? 'Creating Account...' : 'Register'}
                  {!loading && (
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </span>
              </button>

              {/* Link */}
              <p className="text-center text-sm text-blue-200">
                Already have an account?{' '}
                <a
                  href="#login"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('#login');
                  }}
                  className="font-semibold text-blue-300 hover:text-blue-200"
                >
                  Log in
                </a>
              </p>

            </form>
          </div>
{/* 
          <p className="mt-6 text-center text-xs text-blue-300/60">
            Protected by enterprise-grade security
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Register;