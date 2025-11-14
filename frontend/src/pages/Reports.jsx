import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Layout from '../components/Layout';

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
      setLowStock(res.data.filter(p => p.quantity < 20));
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

export default Reports;