// import React, { useEffect, useState } from 'react';
// import { apiGet } from '../api/client.js';

// export default function Dashboard() {
//   const [stats, setStats] = useState(null);
//   const [reorder, setReorder] = useState([]);
//   const [expiring, setExpiring] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadData();
//   }, []);

//   async function loadData() {
//     try {
//       setLoading(true);
//       const [statsData, reorderData, expiringData] = await Promise.all([
//         apiGet('/api/inventory/stats'),
//         apiGet('/api/inventory/reorder-suggestions?top=10'),
//         apiGet('/api/inventory/expiring-batches?daysAhead=30'),
//       ]);
//       setStats(statsData);
//       setReorder(reorderData);
//       setExpiring(expiringData.products || []);
//     } catch (error) {
//       console.error('Failed to load dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return <div style={{ textAlign: 'center', padding: 40 }}>Loading dashboard...</div>;
//   }

//   return (
//     <div>
//       <h2 style={{ marginBottom: 24 }}>Dashboard</h2>

//       {/* Stats Cards */}
//       <div className="grid grid-4" style={{ marginBottom: 24 }}>
//         <div className="card">
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>Total Products</div>
//           <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066cc' }}>
//             {stats?.totalProducts || 0}
//           </div>
//         </div>
//         <div className="card">
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>Inventory Value</div>
//           <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
//             ${(stats?.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </div>
//         </div>
//         <div className="card">
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>Low Stock Items</div>
//           <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
//             {stats?.lowStockCount || 0}
//           </div>
//         </div>
//         <div className="card">
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>Out of Stock</div>
//           <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
//             {stats?.outOfStockCount || 0}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-2">
//         {/* Reorder Suggestions */}
//         <div className="card">
//           <h3 style={{ marginBottom: 16 }}>Top Reorder Suggestions</h3>
//           {reorder.length === 0 ? (
//             <p style={{ color: '#666' }}>No products need reordering</p>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Product</th>
//                   <th>Current</th>
//                   <th>Reorder Level</th>
//                   <th>Priority</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reorder.slice(0, 10).map((p) => (
//                   <tr key={p._id || p.sku}>
//                     <td>
//                       <div style={{ fontWeight: 600 }}>{p.name}</div>
//                       <div style={{ fontSize: '12px', color: '#666' }}>{p.sku}</div>
//                     </td>
//                     <td>
//                       <span className={`badge ${p.quantity <= 0 ? 'danger' : p.quantity < p.reorderLevel ? 'warning' : 'success'}`}>
//                         {p.quantity}
//                       </span>
//                     </td>
//                     <td>{p.reorderLevel}</td>
//                     <td>
//                       {p._suggestion && (
//                         <div>
//                           <div style={{ fontSize: '12px', color: '#666' }}>{p._suggestion.reason}</div>
//                           {p._suggestion.suggestedQuantity > 0 && (
//                             <div style={{ fontSize: '12px', color: '#0066cc' }}>
//                               Suggest: {Math.ceil(p._suggestion.suggestedQuantity)}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Expiring Batches */}
//         <div className="card">
//           <h3 style={{ marginBottom: 16 }}>Expiring Batches (Next 30 Days)</h3>
//           {expiring.length === 0 ? (
//             <p style={{ color: '#666' }}>No batches expiring soon</p>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Product</th>
//                   <th>Batch</th>
//                   <th>Quantity</th>
//                   <th>Expiry</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {expiring.slice(0, 10).map((p) => {
//                   const expiringBatch = p.batches?.find(b => {
//                     if (!b.expiryDate) return false;
//                     const expiry = new Date(b.expiryDate);
//                     const daysUntil = (expiry - new Date()) / (1000 * 60 * 60 * 24);
//                     return daysUntil > 0 && daysUntil <= 30;
//                   });
//                   if (!expiringBatch) return null;
//                   const expiry = new Date(expiringBatch.expiryDate);
//                   const daysUntil = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
//                   return (
//                     <tr key={`${p._id}-${expiringBatch.batchNumber}`}>
//                       <td>{p.name}</td>
//                       <td>{expiringBatch.batchNumber}</td>
//                       <td>{expiringBatch.quantity}</td>
//                       <td>
//                         <span className={`badge ${daysUntil <= 7 ? 'danger' : daysUntil <= 14 ? 'warning' : 'info'}`}>
//                           {daysUntil} days
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
