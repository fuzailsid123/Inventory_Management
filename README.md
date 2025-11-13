Got it ✅ — here’s your **complete README.md** in **one continuous Markdown file**, properly formatted and ready to drop directly into your repository.

---

````markdown
# 📦 Inventory Management System

A full-stack inventory management application featuring a **React frontend** and a **unique Node.js backend**.  
The backend's core business logic and data persistence are handled by **pre-compiled C++ executables**, which are called directly by the Node.js/Express server.

---

## ✨ Features

### 🔐 Core Backend Logic
- **C++ Powered:** All business logic (authentication, product/order management) is handled by compiled C++ executables for performance.
- **Binary File Storage:** Data is persisted in simple, efficient binary files (`.db`) managed directly by the C++ layer.
- **Node.js API Wrapper:** A lightweight Express.js server acts as an API gateway, spawning C++ child processes to handle requests.

### 🔑 Authentication
- **User Registration:** Create new user accounts.  
- **User Login:** Secure login for existing users.  
- **Token-Based Auth:** Uses **JSON Web Tokens (JWT)** to secure API endpoints.

### 🛍️ Product Management
- **Add Products:** Create new products with details like name, quantity, and price.  
- **Edit Products:** Update existing product information.  
- **Delete Products:** Remove products from the inventory.  
- **View All Products:** Get a complete list of all inventory items.

### 🛒 Order Management
- **Add Orders:** Create new orders for products.  
- **View All Orders:** Get a list of all past orders.

### 📊 Reporting
- **Low Stock Report:** Generate a report of products running low on stock.  
- **Sorted Product List:** Get a list of products sorted by different criteria.

---

## 🚀 Getting Started

### Prerequisites
Ensure the following are installed:
- **Node.js** (v18 or higher recommended)  
- **npm** (comes with Node.js)  
- **C++ Compiler:** such as `g++` or equivalent

---

## 🛠️ Installation

```bash
# Clone this repository (or use your existing project folder)
git clone https://your-repo-url/inventory-system.git
cd inventory-system
````

### 1. Setup the Backend

```bash
cd Backend
npm install
mkdir db
npm run compile
```

### 2. Setup the Frontend (in a new terminal)

```bash
cd frontend
npm install
```

---

## 🧑‍💻 Development

### 1. Run the Backend Server (in your Backend terminal)

```bash
npm start
# Server will run on http://localhost:5000
```

### 2. Run the Frontend Server (in your frontend terminal)

```bash
npm run dev
# App will be available at http://localhost:5173
```

---

## 🏗️ Production Build

### Build frontend for production

```bash
cd frontend
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 🧹 Code Quality

Run linter (if configured in `frontend/package.json`):

```bash
cd frontend
npm run lint
```

---

## 📁 Project Structure

```
/
├── frontend/
│   ├── src/            # React application source
│   └── package.json    # Frontend dependencies and scripts
│
└── Backend/
    ├── src/            # Node.js/Express server source
    ├── cpp/            # C++ source code for core logic
    ├── compiled/       # Compiled C++ executables (binaries)
    ├── db/             # Binary database files (e.g., users.db, products.db)
    ├── scripts/        # Build scripts (e.g., compile.js)
    └── package.json    # Backend dependencies and scripts
```

---

## 🎯 Usage Guide

1. **Run the Backend:**
   Follow the development steps to start the backend server first.

2. **Run the Frontend:**
   Start the frontend development server.

3. **Open the App:**
   Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

4. **Register/Login:**
   Use the application interface to create an account or log in.

5. **Manage Inventory:**
   Once logged in, you can add/edit products, create orders, and view reports.
