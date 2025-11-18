import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  FileText,
  LogOut,
  User,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const Layout = ({
  onNavigate = (t) => (window.location.hash = t),
  children,
  title,
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate("#login");
  };

  const navItems = [
    { name: "Dashboard", hash: "#dashboard", icon: LayoutDashboard },
    { name: "Products", hash: "#products", icon: Package },
    { name: "Orders", hash: "#orders", icon: ShoppingCart },
    { name: "Reports", hash: "#reports", icon: FileText },
  ];

  const isActive = (hash) => window.location.hash === hash;

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg"
      >
        {sidebarOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-72 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 border-r border-white/10">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">InventoryPro</h1>
                <p className="text-xs text-blue-200">Smart Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.hash);

              return (
                <a
                  key={item.name}
                  href={item.hash}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.hash);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg"
                      : "hover:bg-white/10 border border-transparent hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        active
                          ? "bg-linear-to-r from-blue-500 to-purple-500 shadow-lg"
                          : "bg-white/5 group-hover:bg-white/10"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          active
                            ? "text-white"
                            : "text-blue-200 group-hover:text-white"
                        }`}
                      />
                    </div>

                    <span
                      className={`font-medium transition-colors ${
                        active
                          ? "text-white"
                          : "text-blue-100 group-hover:text-white"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-all duration-200 ${
                      active
                        ? "text-white translate-x-1"
                        : "text-blue-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div className="mb-4 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full">
                  <User className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-blue-200 truncate">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full group flex items-center justify-center space-x-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/50 transform hover:scale-[1.02] transition-all duration-200"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Logout</span>
              </button>
            </div>

            <div className="text-center">
              {/* <p className="text-xs text-blue-300/60">© 2024 InventoryPro</p> */}
              {/* <p className="text-xs text-blue-300/40 mt-1">Version 1.0.0</p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="lg:flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm hidden">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              {title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                Welcome,{" "}
                <span className="text-blue-600 font-semibold">
                  {user?.name || "User"}
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="ml-12">
            <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
