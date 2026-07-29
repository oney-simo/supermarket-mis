import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// Pages
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Customers from "../pages/Customers";
import Sales from "../pages/Sales";
import Inventory from "../pages/Inventory";
import Categories from "../pages/Categories";
import Suppliers from "../pages/Suppliers";
import Purchases from "../pages/Purchases";
import Reports from "../pages/Reports";
import Users from "../pages/Users";
import ActivityLogs from "../pages/ActivityLogs";
import Settings from "../pages/Settings";
import StockReceiving from "../pages/StockReceiving";

// Wrapper component to apply MainLayout across all protected routes
const ProtectedLayout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Authenticated Application Layout */}
      <Route element={<ProtectedLayout />}>
        
        {/* 1. Accessible by ALL authenticated users (Cashier, Manager & Admin) */}
        <Route element={<ProtectedRoute allowedRoles={['cashier', 'manager', 'admin']} />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>

        {/* 2. Manager & Admin Access Only */}
        <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
          <Route path="/stock-receiving" element={<StockReceiving />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
        </Route>

        {/* 3. Admin Only Access */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Route>

      {/* Catch-all: Redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;