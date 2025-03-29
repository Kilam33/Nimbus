//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Navbar - Fixed at the top */}
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        {/* Sidebar - Fixed on the left side */}
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-800 z-40">
          <Sidebar />
        </div>

        {/* Main Content - Scrollable */}
        <main className="ml-64 mt-16 p-8 flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
