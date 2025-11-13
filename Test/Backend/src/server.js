// const express = require('express');
// const cors = require('cors');
// const path = require('path');

// // --- Create db directory if it doesn't exist ---
// // This is crucial because the C++ apps will try to write here
// const fs = require('fs');
// const dbDir = path.join(__dirname, '.', 'db');
// if (!fs.existsSync(dbDir)) {
//   fs.mkdirSync(dbDir, { recursive: true });
// }
// // ---

// const app = express();
// app.use(cors());
// app.use(express.json());

// // --- Routes ---
// const authRoutes = require('./routes/auth.routes.js');
// const productRoutes = require('./routes/product.routes.js');
// const orderRoutes = require('./routes/order.routes.js');
// const reportRoutes = require('./routes/report.routes.js');

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/reports', reportRoutes);

// // --- Global Error Handler ---
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({ error: err.message || 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log('Make sure to run "npm run compile" to build C++ executables.');
// });

const express = require('express');
const cors = require('cors');
const path = require('path');

// --- Create db directory if it doesn't exist ---
// This is crucial because the C++ apps will try to write here
const fs = require('fs');
// This path goes from /src, up one level ('..') to /Backend, then into /db
const dbDir = path.join(__dirname, '..', 'db'); 
if (!fs.existsSync(dbDir)) {
  console.log(`Creating database directory at: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}
// ---

const app = express();
app.use(cors());
app.use(express.json());

// --- Routes ---
const authRoutes = require('./routes/auth.routes.js');
const productRoutes = require('./routes/product.routes.js');
const orderRoutes = require('./routes/order.routes.js');
const reportRoutes = require('./routes/report.routes.js');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database directory is ready at: ${dbDir}`);
  console.log('Make sure to run "npm run compile" to build C++ executables.');
});