import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";

import UserLogin from "./pages/user/UserLogin";
import RegisterChoice from "./pages/RegisterChoice";
import UserRegister from "./pages/user/UserRegister";
import Home from "./pages/Home";
import CategoryPage from "./pages/Category";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";

import AdminRegister from "./pages/admin/AdminRegister";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AUTH_CHANGE_EVENT } from "./utils/auth";

function App() {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);
    syncAuth();

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, [location.pathname]);

  const showCustomerShell = Boolean(token) && role !== "admin" && !location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased">
      {showCustomerShell && <Navbar />}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/user/Userlogin" element={<UserLogin />} />
        <Route path="/register" element={<RegisterChoice />} />
        <Route path="/user/register" element={<UserRegister />} />

        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/products/:categoryId" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        <Route path="/admin/Adminlogin" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
        <Route path="/admin/AdminProfile" element={<AdminRoute><AdminLayout><AdminProfile /></AdminLayout></AdminRoute>} />
      </Routes>

      {showCustomerShell && <Footer />}
    </div>
  );
}

export default App;
