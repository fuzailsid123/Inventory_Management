// import React, { useEffect, useState } from 'react';
// import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '../api/client.js';
// import ProductForm from '../components/ProductForm.jsx';

// export default function Products() {
//   const [items, setItems] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
//   const [search, setSearch] = useState('');
//   const [category, setCategory] = useState('');
//   const [lowStock, setLowStock] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     loadCategories();
//     load();
//   }, [pagination.page, search, category, lowStock]);

//   async function loadCategories() {
//     try {
//       const cats = await apiGet('/api/products?limit=1000');
//       const uniqueCats = [...new Set(cats.map(p => p.category?.name || p.category).filter(Boolean))];
//       setCategories(uniqueCats);
//     } catch (error) {
//       console.error('Failed to load categories:', error);
//     }
//   }

//   async function load() {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page: pagination.page,
//         limit: pagination.limit,
//       });
//       if (search) params.append('search', search);
//       if (category) params.append('category', category);
//       if (lowStock) params.append('lowStock', 'true');

//       const response = await apiGet(`/api/products?${params}`);
//       const data = response.data || response;
//       setItems(Array.isArray(data) ? data : (data.data || []));
//       if (response.pagination) {
//         setPagination(prev => ({ ...prev, ...response.pagination }));
//       } else if (Array.isArray(response)) {
//         setPagination(prev => ({ ...prev, total: response.length }));
//       }
//     } catch (error) {
//       console.error('Failed to load products:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function onSave(form) {
//     try {
//       if (editing) {
//         await apiPut(`/api/products/${editing._id}`, form);
//       } else {
//         await apiPost('/api/products', form);
//       }
//       setShowForm(false);
//       setEditing(null);
//       await load();
//     } catch (error) {
//       alert(error.message || 'Failed to save product');
//     }
//   }

//   async function onDelete(id) {
//     if (!confirm('Delete product?')) return;
//     try {
//       await apiDelete(`/api/products/${id}`);
//       await load();
//     } catch (error) {
//       alert(error.message || 'Failed to delete product');
//     }
//   }

//   async function updateStock(id, quantity, type, reason) {
//     try {
//       await apiPatch(`/api/products/${id}/stock`, {
//         quantity: Math.abs(quantity),
//         type,
//         reason,
//       });
//       await load();
//     } catch (error) {
//       alert(error.message || 'Failed to update stock');
//     }
//   }

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//         <h2>Products</h2>
//         <button className="primary" onClick={() => { setEditing(null); setShowForm(true); }}>
//           Add Product
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="card" style={{ marginBottom: 20 }}>
//         <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
//           <div>
//             <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Search</label>
//             <input
//               placeholder="Search name/SKU/barcode"
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
//             />
//           </div>
//           <div>
//             <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Category</label>
//             <select value={category} onChange={(e) => { setCategory(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
//               <option value="">All Categories</option>
//               {categories.map(cat => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
//               <input
//                 type="checkbox"
//                 checked={lowStock}
//                 onChange={(e) => { setLowStock(e.target.checked); setPagination(prev => ({ ...prev, page: 1 })); }}
//               />
//               Low Stock Only
//             </label>
//           </div>
//           <button onClick={load} disabled={loading}>Refresh</button>
//         </div>
//       </div>

//       {showForm && (
//         <div className="card" style={{ marginBottom: 20 }}>
//           <ProductForm
//             initial={editing}
//             categories={categories}
//             onSave={onSave}
//             onCancel={() => { setShowForm(false); setEditing(null); }}
//           />
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: 40 }}>Loading products...</div>
//       ) : (
//         <>
//           <div className="card" style={{ overflowX: 'auto' }}>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>SKU</th>
//                   <th>Category</th>
//                   <th>Quantity</th>
//                   <th>Reorder Level</th>
//                   <th>Cost Price</th>
//                   <th>Selling Price</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.length === 0 ? (
//                   <tr>
//                     <td colSpan="9" style={{ textAlign: 'center', padding: 40, color: '#666' }}>
//                       No products found
//                     </td>
//                   </tr>
//                 ) : (
//                   items.map(p => (
//                     <tr key={p._id}>
//                       <td>
//                         <div style={{ fontWeight: 600 }}>{p.name}</div>
//                         {p.barcode && <div style={{ fontSize: '12px', color: '#666' }}>Barcode: {p.barcode}</div>}
//                       </td>
//                       <td>{p.sku}</td>
//                       <td>{p.category?.name || p.category || '-'}</td>
//                       <td>
//                         <span className={`badge ${p.quantity <= 0 ? 'danger' : p.quantity < p.reorderLevel ? 'warning' : 'success'}`}>
//                           {p.quantity}
//                         </span>
//                       </td>
//                       <td>{p.reorderLevel}</td>
//                       <td>${p.costPrice?.toFixed(2) || '0.00'}</td>
//                       <td>${p.sellingPrice?.toFixed(2) || '0.00'}</td>
//                       <td>
//                         <span className={`badge ${p.isActive ? 'success' : 'danger'}`}>
//                           {p.isActive ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td>
//                         <div style={{ display: 'flex', gap: 4 }}>
//                           <button onClick={() => { setEditing(p); setShowForm(true); }} style={{ fontSize: '12px', padding: '4px 8px' }}>
//                             Edit
//                           </button>
//                           <button
//                             className="danger"
//                             onClick={() => onDelete(p._id)}
//                             style={{ fontSize: '12px', padding: '4px 8px' }}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
//               <button
//                 onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
//                 disabled={!pagination.hasPrev}
//               >
//                 Previous
//               </button>
//               <span style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
//                 Page {pagination.page} of {pagination.totalPages}
//               </span>
//               <button
//                 onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
//                 disabled={!pagination.hasNext}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
