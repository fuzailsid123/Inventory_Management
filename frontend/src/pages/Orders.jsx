// import React, { useEffect, useState } from 'react';
// import { apiGet, apiPost, apiPut } from '../api/client.js';

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
//   const [status, setStatus] = useState('');
//   const [type, setType] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     type: 'sale',
//     items: [{ product: '', quantity: 1, unitPrice: 0 }],
//     customer: { name: '', email: '', phone: '' },
//     paymentMethod: 'cash',
//     notes: '',
//   });

//   useEffect(() => {
//     loadProducts();
//     load();
//   }, [pagination.page, status, type]);

//   async function loadProducts() {
//     try {
//       const data = await apiGet('/api/products?limit=1000');
//       setProducts(data.data || data);
//     } catch (error) {
//       console.error('Failed to load products:', error);
//     }
//   }

//   async function load() {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page: pagination.page,
//         limit: pagination.limit,
//       });
//       if (status) params.append('status', status);
//       if (type) params.append('type', type);

//       const response = await apiGet(`/api/orders?${params}`);
//       const data = response.data || response;
//       setOrders(Array.isArray(data) ? data : (data.data || []));
//       if (response.pagination) {
//         setPagination(prev => ({ ...prev, ...response.pagination }));
//       } else if (Array.isArray(response)) {
//         setPagination(prev => ({ ...prev, total: response.length }));
//       }
//     } catch (error) {
//       console.error('Failed to load orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function addItem() {
//     setForm(prev => ({
//       ...prev,
//       items: [...prev.items, { product: '', quantity: 1, unitPrice: 0 }],
//     }));
//   }

//   function removeItem(index) {
//     setForm(prev => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index),
//     }));
//   }

//   function updateItem(index, field, value) {
//     setForm(prev => ({
//       ...prev,
//       items: prev.items.map((item, i) =>
//         i === index ? { ...item, [field]: value } : item
//       ),
//     }));
//   }

//   function updateProductPrice(index) {
//     const productId = form.items[index].product;
//     const product = products.find(p => p._id === productId);
//     if (product) {
//       updateItem(index, 'unitPrice', product.sellingPrice || 0);
//     }
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     try {
//       const orderData = {
//         ...form,
//         items: form.items
//           .filter(item => item.product && item.quantity > 0)
//           .map(item => ({
//             product: item.product,
//             quantity: item.quantity,
//             unitPrice: item.unitPrice,
//           })),
//       };
//       await apiPost('/api/orders', orderData);
//       setShowForm(false);
//       setForm({
//         type: 'sale',
//         items: [{ product: '', quantity: 1, unitPrice: 0 }],
//         customer: { name: '', email: '', phone: '' },
//         paymentMethod: 'cash',
//         notes: '',
//       });
//       await load();
//     } catch (error) {
//       alert(error.message || 'Failed to create order');
//     }
//   }

//   async function updateOrderStatus(orderId, newStatus) {
//     try {
//       await apiPut(`/api/orders/${orderId}`, { status: newStatus });
//       await load();
//     } catch (error) {
//       alert(error.message || 'Failed to update order');
//     }
//   }

//   const calculateTotal = () => {
//     return form.items.reduce((sum, item) => {
//       const price = item.unitPrice || 0;
//       const qty = item.quantity || 0;
//       return sum + (price * qty);
//     }, 0);
//   };

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//         <h2>Orders</h2>
//         <button className="primary" onClick={() => setShowForm(true)}>
//           Create Order
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="card" style={{ marginBottom: 20 }}>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
//           <div>
//             <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Status</label>
//             <select value={status} onChange={(e) => { setStatus(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
//               <option value="">All Statuses</option>
//               <option value="pending">Pending</option>
//               <option value="processing">Processing</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//           <div>
//             <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Type</label>
//             <select value={type} onChange={(e) => { setType(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
//               <option value="">All Types</option>
//               <option value="sale">Sale</option>
//               <option value="purchase">Purchase</option>
//               <option value="transfer">Transfer</option>
//               <option value="return">Return</option>
//             </select>
//           </div>
//           <button onClick={load} disabled={loading}>Refresh</button>
//         </div>
//       </div>

//       {showForm && (
//         <div className="card" style={{ marginBottom: 20 }}>
//           <h3 style={{ marginBottom: 16 }}>Create New Order</h3>
//           <form onSubmit={handleSubmit}>
//             <div style={{ marginBottom: 16 }}>
//               <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//                 Order Type
//               </label>
//               <select name="type" value={form.type} onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}>
//                 <option value="sale">Sale</option>
//                 <option value="purchase">Purchase</option>
//                 <option value="transfer">Transfer</option>
//                 <option value="return">Return</option>
//               </select>
//             </div>

//             <div style={{ marginBottom: 16 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
//                 <label style={{ fontSize: '14px', fontWeight: 600 }}>Items</label>
//                 <button type="button" onClick={addItem} style={{ fontSize: '12px', padding: '4px 8px' }}>
//                   Add Item
//                 </button>
//               </div>
//               {form.items.map((item, index) => (
//                 <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
//                   <select
//                     value={item.product}
//                     onChange={(e) => {
//                       updateItem(index, 'product', e.target.value);
//                       updateProductPrice(index);
//                     }}
//                     required
//                   >
//                     <option value="">Select Product</option>
//                     {products.map(p => (
//                       <option key={p._id} value={p._id}>
//                         {p.name} ({p.sku}) - Stock: {p.quantity}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     placeholder="Quantity"
//                     value={item.quantity}
//                     onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
//                     required
//                   />
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     placeholder="Unit Price"
//                     value={item.unitPrice}
//                     onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
//                     required
//                   />
//                   <button type="button" onClick={() => removeItem(index)} className="danger" style={{ fontSize: '12px', padding: '4px 8px' }}>
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               <div style={{ marginTop: 8, fontWeight: 600, textAlign: 'right' }}>
//                 Total: ${calculateTotal().toFixed(2)}
//               </div>
//             </div>

//             {form.type === 'sale' && (
//               <div className="grid grid-3" style={{ marginBottom: 16 }}>
//                 <div>
//                   <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Customer Name</label>
//                   <input
//                     value={form.customer.name}
//                     onChange={(e) => setForm(prev => ({ ...prev, customer: { ...prev.customer, name: e.target.value } }))}
//                   />
//                 </div>
//                 <div>
//                   <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Email</label>
//                   <input
//                     type="email"
//                     value={form.customer.email}
//                     onChange={(e) => setForm(prev => ({ ...prev, customer: { ...prev.customer, email: e.target.value } }))}
//                   />
//                 </div>
//                 <div>
//                   <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Phone</label>
//                   <input
//                     value={form.customer.phone}
//                     onChange={(e) => setForm(prev => ({ ...prev, customer: { ...prev.customer, phone: e.target.value } }))}
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="grid grid-2" style={{ marginBottom: 16 }}>
//               <div>
//                 <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Payment Method</label>
//                 <select
//                   value={form.paymentMethod}
//                   onChange={(e) => setForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
//                 >
//                   <option value="cash">Cash</option>
//                   <option value="card">Card</option>
//                   <option value="bank_transfer">Bank Transfer</option>
//                   <option value="credit">Credit</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Notes</label>
//                 <input
//                   value={form.notes}
//                   onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
//                   placeholder="Order notes"
//                 />
//               </div>
//             </div>

//             <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//               <button type="button" onClick={() => { setShowForm(false); setForm({ type: 'sale', items: [{ product: '', quantity: 1, unitPrice: 0 }], customer: { name: '', email: '', phone: '' }, paymentMethod: 'cash', notes: '' }); }}>
//                 Cancel
//               </button>
//               <button type="submit" className="primary">Create Order</button>
//             </div>
//           </form>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: 40 }}>Loading orders...</div>
//       ) : (
//         <>
//           <div className="card" style={{ overflowX: 'auto' }}>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Order Number</th>
//                   <th>Type</th>
//                   <th>Status</th>
//                   <th>Items</th>
//                   <th>Total</th>
//                   <th>Payment</th>
//                   <th>Date</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" style={{ textAlign: 'center', padding: 40, color: '#666' }}>
//                       No orders found
//                     </td>
//                   </tr>
//                 ) : (
//                   orders.map(order => (
//                     <tr key={order._id}>
//                       <td>{order.orderNumber}</td>
//                       <td>
//                         <span className={`badge ${order.type === 'sale' ? 'success' : order.type === 'purchase' ? 'info' : 'warning'}`}>
//                           {order.type}
//                         </span>
//                       </td>
//                       <td>
//                         <select
//                           value={order.status}
//                           onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                           style={{ padding: '4px 8px', fontSize: '12px' }}
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="processing">Processing</option>
//                           <option value="completed">Completed</option>
//                           <option value="cancelled">Cancelled</option>
//                         </select>
//                       </td>
//                       <td>{order.items?.length || 0} items</td>
//                       <td>${order.total?.toFixed(2) || '0.00'}</td>
//                       <td>
//                         <span className={`badge ${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
//                           {order.paymentStatus || 'pending'}
//                         </span>
//                       </td>
//                       <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                       <td>
//                         <button onClick={() => alert(`Order details for ${order.orderNumber}`)} style={{ fontSize: '12px', padding: '4px 8px' }}>
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {pagination.totalPages > 1 && (
//             <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
//               <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))} disabled={!pagination.hasPrev}>
//                 Previous
//               </button>
//               <span style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
//                 Page {pagination.page} of {pagination.totalPages}
//               </span>
//               <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))} disabled={!pagination.hasNext}>
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
