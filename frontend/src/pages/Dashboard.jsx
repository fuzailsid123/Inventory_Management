import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

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

export default Dashboard;