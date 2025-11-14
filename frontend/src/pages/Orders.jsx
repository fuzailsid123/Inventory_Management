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

export default Orders;