// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Suppliers from "./pages/Suppliers";
import Analytics from "./pages/Analytics";
import Hero from "./pages/Hero";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route - Hero page with auth modals */}
          <Route path="/" element={<Hero />} />

          {/* Protected routes with layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-900 flex flex-col">
                  <div className="fixed top-0 left-0 w-full z-50">
                    <Navbar />
                  </div>
                  <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-800 z-40">
                    <Sidebar />
                  </div>
                  <main className="ml-64 mt-16 p-8 flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    <Dashboard />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-900 flex flex-col">
                  <div className="fixed top-0 left-0 w-full z-50">
                    <Navbar />
                  </div>
                  <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-800 z-40">
                    <Sidebar />
                  </div>
                  <main className="ml-64 mt-16 p-8 flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    <Products />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-900 flex flex-col">
                  <div className="fixed top-0 left-0 w-full z-50">
                    <Navbar />
                  </div>
                  <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-800 z-40">
                    <Sidebar />
                  </div>
                  <main className="ml-64 mt-16 p-8 flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    <Categories />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-900 flex flex-col">
                  <div className="fixed top-0 left-0 w-full z-50">
                    <Navbar />
                  </div>
                  <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-800 z-40">
                    <Sidebar />
                  </div>
                  <main className="ml-64 mt-16 p-8 flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    <Orders />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-900 flex flex-col">
                  <div className="fixed top-0 left-0 w-full z-50">
                    <Navbar />
                  </div>
                  <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-800 z-40">
                    <Sidebar />
                  </div>
                  <main className="ml-64 mt-16 p-8 flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    <Suppliers />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-900 flex flex-col">
                  <div className="fixed top-0 left-0 w-full z-50">
                    <Navbar />
                  </div>
                  <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-800 z-40">
                    <Sidebar />
                  </div>
                  <main className="ml-64 mt-16 p-8 flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    <Analytics />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;