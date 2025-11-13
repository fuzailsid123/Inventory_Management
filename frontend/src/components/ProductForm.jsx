// import React, { useState, useEffect } from 'react';

// export default function ProductForm({ initial, categories = [], onSave, onCancel }) {
//   const [form, setForm] = useState({
//     name: '',
//     sku: '',
//     barcode: '',
//     description: '',
//     category: '',
//     supplier: '',
//     quantity: 0,
//     reorderLevel: 0,
//     reorderQuantity: 0,
//     maxStock: 0,
//     turnoverRate: 0,
//     costPrice: 0,
//     sellingPrice: 0,
//     unit: 'piece',
//     isActive: true,
//   });

//   useEffect(() => {
//     if (initial) {
//       setForm({
//         name: initial.name || '',
//         sku: initial.sku || '',
//         barcode: initial.barcode || '',
//         description: initial.description || '',
//         category: initial.category?._id || initial.category || '',
//         supplier: initial.supplier?._id || initial.supplier || '',
//         quantity: initial.quantity || 0,
//         reorderLevel: initial.reorderLevel || 0,
//         reorderQuantity: initial.reorderQuantity || 0,
//         maxStock: initial.maxStock || 0,
//         turnoverRate: initial.turnoverRate || 0,
//         costPrice: initial.costPrice || 0,
//         sellingPrice: initial.sellingPrice || 0,
//         unit: initial.unit || 'piece',
//         isActive: initial.isActive !== undefined ? initial.isActive : true,
//       });
//     }
//   }, [initial]);

//   function handleChange(e) {
//     const { name, value, type, checked } = e.target;
//     setForm((f) => ({
//       ...f,
//       [name]: type === 'checkbox' ? checked : type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
//     }));
//   }

//   function submit(e) {
//     e.preventDefault();
//     onSave(form);
//   }

//   return (
//     <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
//       <h3 style={{ marginBottom: 8 }}>{initial ? 'Edit Product' : 'Add Product'}</h3>
      
//       <div className="grid grid-2">
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Product Name *
//           </label>
//           <input
//             name="name"
//             placeholder="Product Name"
//             value={form.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             SKU *
//           </label>
//           <input
//             name="sku"
//             placeholder="SKU"
//             value={form.sku}
//             onChange={handleChange}
//             required
//             style={{ textTransform: 'uppercase' }}
//           />
//         </div>
//       </div>

//       <div className="grid grid-2">
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Barcode
//           </label>
//           <input
//             name="barcode"
//             placeholder="Barcode"
//             value={form.barcode}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Unit
//           </label>
//           <select name="unit" value={form.unit} onChange={handleChange}>
//             <option value="piece">Piece</option>
//             <option value="kg">Kilogram</option>
//             <option value="liter">Liter</option>
//             <option value="box">Box</option>
//             <option value="pack">Pack</option>
//           </select>
//         </div>
//       </div>

//       <div>
//         <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//           Description
//         </label>
//         <textarea
//           name="description"
//           placeholder="Product description"
//           value={form.description}
//           onChange={handleChange}
//           rows={3}
//         />
//       </div>

//       <div className="grid grid-2">
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Category
//           </label>
//           <input
//             name="category"
//             placeholder="Category name"
//             value={form.category}
//             onChange={handleChange}
//             list="categories"
//           />
//           <datalist id="categories">
//             {categories.map(cat => <option key={cat} value={cat} />)}
//           </datalist>
//         </div>
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Supplier
//           </label>
//           <input
//             name="supplier"
//             placeholder="Supplier ID or name"
//             value={form.supplier}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       <div className="grid grid-3">
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Quantity *
//           </label>
//           <input
//             name="quantity"
//             type="number"
//             step="0.01"
//             placeholder="0"
//             value={form.quantity}
//             onChange={handleChange}
//             required
//             min="0"
//           />
//         </div>
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Reorder Level *
//           </label>
//           <input
//             name="reorderLevel"
//             type="number"
//             step="0.01"
//             placeholder="0"
//             value={form.reorderLevel}
//             onChange={handleChange}
//             required
//             min="0"
//           />
//         </div>
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Max Stock
//           </label>
//           <input
//             name="maxStock"
//             type="number"
//             step="0.01"
//             placeholder="0"
//             value={form.maxStock}
//             onChange={handleChange}
//             min="0"
//           />
//         </div>
//       </div>

//       <div className="grid grid-3">
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Cost Price
//           </label>
//           <input
//             name="costPrice"
//             type="number"
//             step="0.01"
//             placeholder="0.00"
//             value={form.costPrice}
//             onChange={handleChange}
//             min="0"
//           />
//         </div>
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Selling Price
//           </label>
//           <input
//             name="sellingPrice"
//             type="number"
//             step="0.01"
//             placeholder="0.00"
//             value={form.sellingPrice}
//             onChange={handleChange}
//             min="0"
//           />
//         </div>
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: 600 }}>
//             Turnover Rate
//           </label>
//           <input
//             name="turnoverRate"
//             type="number"
//             step="0.01"
//             placeholder="0.00"
//             value={form.turnoverRate}
//             onChange={handleChange}
//             min="0"
//           />
//         </div>
//       </div>

//       <div>
//         <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
//           <input
//             type="checkbox"
//             name="isActive"
//             checked={form.isActive}
//             onChange={handleChange}
//           />
//           <span>Product is active</span>
//         </label>
//       </div>

//       <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//         <button type="button" onClick={onCancel}>Cancel</button>
//         <button type="submit" className="primary">Save Product</button>
//       </div>
//     </form>
//   );
// }
