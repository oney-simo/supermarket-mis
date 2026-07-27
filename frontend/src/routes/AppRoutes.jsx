import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

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


function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/products"
        element={
          <MainLayout>
            <Products />
          </MainLayout>
        }
      />

      <Route
        path="/customers"
        element={
          <MainLayout>
            <Customers />
          </MainLayout>
        }
      />

      <Route
        path="/sales"
        element={
          <MainLayout>
            <Sales />
          </MainLayout>
        }
      />

      <Route
        path="/inventory"
        element={
          <MainLayout>
            <Inventory />
          </MainLayout>
        }
      />

      <Route
        path="/categories"
        element={
          <MainLayout>
            <Categories />
          </MainLayout>
        }
      />

      <Route
        path="/suppliers"
        element={
          <MainLayout>
            <Suppliers />
          </MainLayout>
        }
      />

      <Route
        path="/purchases"
        element={
          <MainLayout>
            <Purchases />
          </MainLayout>
        }
      />

      <Route
        path="/reports"
        element={
          <MainLayout>
            <Reports />
          </MainLayout>
        }
      />

      <Route
        path="/users"
        element={
          <MainLayout>
            <Users />
          </MainLayout>
        }
      />

      <Route
        path="/activity-logs"
        element={
          <MainLayout>
            <ActivityLogs />
          </MainLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <MainLayout>
            <Settings />
          </MainLayout>
        }
      />

    </Routes>
  );
}

export default AppRoutes;