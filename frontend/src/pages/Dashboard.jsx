import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Layout from '../components/Layout';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Activity,
  ArrowUp
} from 'lucide-react';

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
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">

        {/* Welcome Header */}
        <div className="mb-8">
          <p className="text-gray-600">Here's what's happening with your inventory today.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading stats...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">

              {/* Total Products */}
              <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-600 text-sm font-semibold">
                      <ArrowUp className="w-4 h-4" />
                      <span>12%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {stats.products}
                    </p>
                  </div>
                </div>
              </div>

              {/* Low Stock Items */}
              <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    {stats.lowStock > 0 && (
                      <div className="flex items-center space-x-1 text-red-600 text-sm font-semibold">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span>Alert</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Low Stock Items</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      {stats.lowStock}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => onNavigate('#products')}
                className="group flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl rounded-xl border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-700">View Products</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400 transform rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('#reports')}
                className="group flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl rounded-xl border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-semibold text-gray-700">View Reports</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400 transform rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('#products')}
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white">Add Product</span>
                </div>
                <ArrowUp className="w-4 h-4 text-white transform rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Activity */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <p className="text-sm text-gray-700">System running smoothly</p>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <p className="text-sm text-gray-700">All services operational</p>
                  </div>
                  {stats.lowStock > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      <p className="text-sm text-gray-700">{stats.lowStock} items need restocking</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Quick Stats</h3>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Inventory Health</span>
                    <span className="text-sm font-bold text-blue-600">
                      {stats.lowStock === 0 ? 'Excellent' : stats.lowStock < 5 ? 'Good' : 'Needs Attention'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Stock Level</span>
                    <span className="text-sm font-bold text-purple-600">
                      {Math.round((stats.products - stats.lowStock) / stats.products * 100) || 0}%
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
