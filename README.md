Inventory Management System (Node/Express + React + C++ DSA)

Overview
This is a full-stack inventory management web app with:
- Backend: Node.js + Express + MongoDB
- Frontend: React (Vite)
- DSA module: C++17 implementing topKToReorder and exposed to Node via N-API

Repository Layout
inventory-system/
  backend/
    src/
      index.js
      routes/
        products.js
        orders.js
        inventory.js
      models/
        Product.js
        Order.js
      services/
        reorderService.js
    tests/
      products.test.js
    jest.config.js
    package.json
    .env.example
  frontend/
    index.html
    vite.config.js
    src/
      main.jsx
      App.jsx
      api/
        client.js
      pages/
        Dashboard.jsx
        Products.jsx
        Orders.jsx
        Reports.jsx
      components/
        ProductForm.jsx
    package.json
  dsa/
    src/
      dsa_algos.h
      dsa_algos.cpp
      index.cpp
    binding.gyp
    package.json
  postman_collection.json

Functional Highlights
- CRUD for products and orders.
- Inventory endpoint /api/inventory/reorder-suggestions?top=N returning top N SKUs needing reorder, using the C++ module by default with fallbacks.
- Frontend pages for Dashboard (quick stats + reorder suggestions), Products (list/search/add/edit/delete), Orders (basic create/list) and Reports (placeholder).

Quick Start
Prereqs:
- Node 18+
- Python 3.x and node-gyp prerequisites
- C++ build tools (Windows: Visual Studio Build Tools; macOS: Xcode CLT; Linux: build-essential)
- MongoDB running locally (or Atlas)

1) Build the DSA native addon
cd dsa
npm install
npm run build

This produces build/Release/dsa.node.

Alternative: install dsa into backend (recommended)
cd backend
npm install ../dsa

2) Backend
cd backend
cp .env.example .env
# edit .env with your Mongo connection string
npm install
npm run dev

Default server runs on http://localhost:4000

3) Frontend
cd frontend
npm install
npm run dev

Visit the printed local URL (typically http://localhost:5173).

DSA Integration Options
1) Native N-API addon (default)
- Build in dsa (npm run build).
- Install into backend (npm install ../dsa) or backend requires the local package if installed.

2) WebAssembly (Emscripten) - optional
- Build with Emscripten (example):
  emcc src/dsa_algos.cpp -sMODULARIZE -sEXPORT_NAME=DSA -sENVIRONMENT=node -O3 -o dist/dsa.js
- Adjust backend/src/services/reorderService.js to import the WASM module and call the exported function. A stub is included to guide this integration.

3) Child-process approach
- A simple Node runner can be built to invoke a C++ CLI or Node script that computes the topK and returns JSON over stdout. A stub fallback is provided in reorderService.js using a pure JS scorer if addon is missing.

Environment Variables (backend/.env)
PORT=4000
MONGO_URI=mongodb://localhost:27017/inventorydb
DSA_MODE=addon # addon | js | wasm | child

Dev/Run Commands
- DSA: cd dsa && npm install && npm run build
- Backend: cd backend && npm install && npm run dev
- Frontend: cd frontend && npm install && npm run dev

Tests
Backend tests (Jest + supertest)
cd backend
npm test

DSA minimal test
cd dsa
node -e "const dsa=require('./build/Release/dsa');console.log(dsa.topKToReorder([{sku:'A',quantity:2,reorderLevel:5,turnoverRate:1.2,lastSoldDate:'2025-01-01'}],1))"

Windows Build Notes (Native Addon)
- Install Node 18+
- Install windows-build-tools or Visual Studio Build Tools (Desktop development with C++)
- Ensure Python 3 is installed and in PATH
- Run: npm config set msvs_version 2022 (or your version)
- Then run: npm install && npm run build inside dsa

API Overview
Products
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

Orders
- GET /api/orders
- POST /api/orders
  Body: { items: [{ productId, quantity }], note? }
  This will decrement product quantities.

Inventory
- GET /api/inventory/reorder-suggestions?top=N

Example cURL
# Create product
curl -X POST http://localhost:4000/api/products -H "Content-Type: application/json" -d "{\"name\":\"Widget\",\"sku\":\"W-001\",\"category\":\"Gadgets\",\"quantity\":3,\"reorderLevel\":10,\"turnoverRate\":1.4,\"lastSoldDate\":\"2025-11-01\"}"

# List products
curl http://localhost:4000/api/products

# Reorder suggestions (top 5)
curl http://localhost:4000/api/inventory/reorder-suggestions?top=5

Postman
Import postman_collection.json from the repo root to try endpoints.

Notes
- Frontend is minimal but functional for Products and Dashboard. Extend Orders and Reports as needed.
- The DSA scoring function balances stock deficiency, turnover rate, and recency.

