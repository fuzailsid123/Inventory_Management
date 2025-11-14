import React, { useState, useEffect, useRef } from 'react';
import api from '../api/client';
import Layout from '../components/Layout';
import OrderForm from '../components/OrderForm';

const Orders = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  
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
      fetchOrdersAndProducts();
    } catch (err) {
      console.error('Failed to create order', err);
      setError(err.response?.data?.error || 'Failed to create order. Insufficient stock?');
    }
  };

  const getProductName = (id) => {
    return productMap.current.get(id)?.name || 'Unknown Product';
  };

  const getOrderStatus = (order) => {
    // You can implement your own status logic here
    return 'completed'; // or 'pending', 'processing', etc.
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout onNavigate={onNavigate} title="Order Management">
      <div className="mb-8">
        <p className="text-gray-600 mt-2">Manage customer orders and track fulfillment</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-sm text-blue-700 font-medium">Total Orders: {orders.length}</span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <span className="text-sm text-green-700 font-medium">
              Completed: {orders.filter(o => getOrderStatus(o) === 'completed').length}
            </span>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
            <span className="text-sm text-yellow-700 font-medium">
              Pending: {orders.filter(o => getOrderStatus(o) === 'pending').length}
            </span>
          </div>
        </div>
        
        {/* Blue to Purple Gradient Create New Order Button */}
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-white font-semibold">Create New Order</span>
          </div>
          <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg cursor-pointer" onClick={() => setError('')}>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
          <p className="text-red-600 text-sm mt-1">Click to dismiss</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-2 text-gray-500">Get started by creating your first order.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center space-x-2 mx-auto"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Your First Order</span>
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const status = getOrderStatus(order);
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Customer: {order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-green-600">${order.totalValue?.toFixed(2)}</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items?.slice(0, order.itemCount).map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">
                            {item.quantity} x {getProductName(item.productId)}
                          </span>
                          <span className="text-gray-900 font-medium">
                            ${(item.quantity * item.pricePerItem).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        View Details
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium hover:bg-red-50 rounded-lg transition-colors duration-200">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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

export default Orders;