import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Layout from '../components/Layout';

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
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600 text-sm font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
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
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
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
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700">View Products</span>
                </div>
                <svg className="w-4 h-4 text-gray-400 transform rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>

              <button
                onClick={() => onNavigate('#reports')}
                className="group flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl rounded-xl border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700">View Reports</span>
                </div>
                <svg className="w-4 h-4 text-gray-400 transform rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>

              <button
                onClick={() => onNavigate('#orders')}
                className="group flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl rounded-xl border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700">View Orders</span>
                </div>
                <svg className="w-4 h-4 text-gray-400 transform rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>

              <button
                onClick={() => onNavigate('#products')}
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="font-semibold text-white">Add Product</span>
                </div>
                <svg className="w-4 h-4 text-white transform rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Activity */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
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
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
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