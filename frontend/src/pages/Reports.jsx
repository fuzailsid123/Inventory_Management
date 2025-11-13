// import React, { useEffect, useState } from 'react';
// import { apiGet } from '../api/client.js';

// export default function Reports() {
//   const [abcAnalysis, setAbcAnalysis] = useState(null);
//   const [inventoryStats, setInventoryStats] = useState(null);
//   const [expiringBatches, setExpiringBatches] = useState([]);
//   const [lowStock, setLowStock] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadReports();
//   }, []);

//   async function loadReports() {
//     try {
//       setLoading(true);
//       const [abc, stats, expiring, lowStockData] = await Promise.all([
//         apiGet('/api/inventory/abc-analysis'),
//         apiGet('/api/inventory/stats'),
//         apiGet('/api/inventory/expiring-batches?daysAhead=30'),
//         apiGet('/api/inventory/low-stock?limit=50'),
//       ]);
//       setAbcAnalysis(abc);
//       setInventoryStats(stats);
//       setExpiringBatches(expiring.products || []);
//       setLowStock(lowStockData.products || []);
//     } catch (error) {
//       console.error('Failed to load reports:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return <div style={{ textAlign: 'center', padding: 40 }}>Loading reports...</div>;
//   }

//   return (
//     <div>
//       <h2 style={{ marginBottom: 24 }}>Reports & Analytics</h2>

//       {/* Inventory Statistics */}
//       {inventoryStats && (
//         <div className="card" style={{ marginBottom: 24 }}>
//           <h3 style={{ marginBottom: 16 }}>Inventory Statistics</h3>
//           <div className="grid grid-4">
//             <div>
//               <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>Total Products</div>
//               <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{inventoryStats.totalProducts || 0}</div>
//             </div>
//             <div>
//               <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>Total Value</div>
//               <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
//                 ${(inventoryStats.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </div>
//             </div>
//             <div>
//               <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>Low Stock Value</div>
//               <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
//                 ${(inventoryStats.lowStockValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </div>
//             </div>
//             <div>
//               <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>Low Stock Count</div>
//               <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
//                 {inventoryStats.lowStockCount || 0}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ABC Analysis */}
//       {abcAnalysis && (
//         <div className="card" style={{ marginBottom: 24 }}>
//           <h3 style={{ marginBottom: 16 }}>ABC Analysis</h3>
//           <p style={{ color: '#666', marginBottom: 16, fontSize: '14px' }}>
//             Products categorized by inventory value: Category A (80% of value), Category B (15% of value), Category C (5% of value)
//           </p>
//           <div className="grid grid-3">
//             <div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
//                 <h4 style={{ margin: 0, color: '#28a745' }}>Category A</h4>
//                 <span className="badge success">{abcAnalysis.A?.length || 0} products</span>
//               </div>
//               <div style={{ maxHeight: 300, overflowY: 'auto' }}>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Product</th>
//                       <th>Value</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(abcAnalysis.A || []).slice(0, 20).map((p) => (
//                       <tr key={p._id}>
//                         <td>
//                           <div style={{ fontSize: '12px', fontWeight: 600 }}>{p.name}</div>
//                           <div style={{ fontSize: '11px', color: '#666' }}>{p.sku}</div>
//                         </td>
//                         <td>${((p.quantity || 0) * (p.costPrice || 0)).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             <div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
//                 <h4 style={{ margin: 0, color: '#ffc107' }}>Category B</h4>
//                 <span className="badge warning">{abcAnalysis.B?.length || 0} products</span>
//               </div>
//               <div style={{ maxHeight: 300, overflowY: 'auto' }}>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Product</th>
//                       <th>Value</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(abcAnalysis.B || []).slice(0, 20).map((p) => (
//                       <tr key={p._id}>
//                         <td>
//                           <div style={{ fontSize: '12px', fontWeight: 600 }}>{p.name}</div>
//                           <div style={{ fontSize: '11px', color: '#666' }}>{p.sku}</div>
//                         </td>
//                         <td>${((p.quantity || 0) * (p.costPrice || 0)).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             <div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
//                 <h4 style={{ margin: 0, color: '#6c757d' }}>Category C</h4>
//                 <span className="badge info">{abcAnalysis.C?.length || 0} products</span>
//               </div>
//               <div style={{ maxHeight: 300, overflowY: 'auto' }}>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Product</th>
//                       <th>Value</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(abcAnalysis.C || []).slice(0, 20).map((p) => (
//                       <tr key={p._id}>
//                         <td>
//                           <div style={{ fontSize: '12px', fontWeight: 600 }}>{p.name}</div>
//                           <div style={{ fontSize: '11px', color: '#666' }}>{p.sku}</div>
//                         </td>
//                         <td>${((p.quantity || 0) * (p.costPrice || 0)).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-2">
//         {/* Low Stock Products */}
//         <div className="card">
//           <h3 style={{ marginBottom: 16 }}>Low Stock Products</h3>
//           {lowStock.length === 0 ? (
//             <p style={{ color: '#666' }}>No low stock products</p>
//           ) : (
//             <div style={{ maxHeight: 400, overflowY: 'auto' }}>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Product</th>
//                     <th>Quantity</th>
//                     <th>Reorder Level</th>
//                     <th>Deficit</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {lowStock.map((p) => {
//                     const deficit = (p.reorderLevel || 0) - (p.quantity || 0);
//                     return (
//                       <tr key={p._id}>
//                         <td>
//                           <div style={{ fontWeight: 600 }}>{p.name}</div>
//                           <div style={{ fontSize: '12px', color: '#666' }}>{p.sku}</div>
//                         </td>
//                         <td>
//                           <span className={`badge ${p.quantity <= 0 ? 'danger' : 'warning'}`}>
//                             {p.quantity}
//                           </span>
//                         </td>
//                         <td>{p.reorderLevel}</td>
//                         <td>
//                           <span className="badge danger">{deficit}</span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Expiring Batches */}
//         <div className="card">
//           <h3 style={{ marginBottom: 16 }}>Expiring Batches (Next 30 Days)</h3>
//           {expiringBatches.length === 0 ? (
//             <p style={{ color: '#666' }}>No batches expiring soon</p>
//           ) : (
//             <div style={{ maxHeight: 400, overflowY: 'auto' }}>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Product</th>
//                     <th>Batch</th>
//                     <th>Quantity</th>
//                     <th>Days Until Expiry</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {expiringBatches.map((p) => {
//                     const expiringBatch = p.batches?.find(b => {
//                       if (!b.expiryDate) return false;
//                       const expiry = new Date(b.expiryDate);
//                       const daysUntil = (expiry - new Date()) / (1000 * 60 * 60 * 24);
//                       return daysUntil > 0 && daysUntil <= 30;
//                     });
//                     if (!expiringBatch) return null;
//                     const expiry = new Date(expiringBatch.expiryDate);
//                     const daysUntil = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
//                     return (
//                       <tr key={`${p._id}-${expiringBatch.batchNumber}`}>
//                         <td>
//                           <div style={{ fontWeight: 600 }}>{p.name}</div>
//                           <div style={{ fontSize: '12px', color: '#666' }}>{p.sku}</div>
//                         </td>
//                         <td>{expiringBatch.batchNumber}</td>
//                         <td>{expiringBatch.quantity}</td>
//                         <td>
//                           <span className={`badge ${daysUntil <= 7 ? 'danger' : daysUntil <= 14 ? 'warning' : 'info'}`}>
//                             {daysUntil} days
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
