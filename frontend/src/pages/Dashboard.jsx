import { useEffect, useState } from "react";
import api from "../api/axios";

// Modern SVG Icon Imports
import { 
  Package, 
  Truck, 
  Users, 
  ShoppingCart, 
  Banknote,
  AlertTriangle
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import StockAlert from "../components/dashboard/StockAlert";
import { getSettings } from "../api/settingsApi";
import "../styles/dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardAlerts, setDashboardAlerts] = useState(null);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setDashboardData(response.data);
      } catch (error) {
        console.log(error);
        setError("Failed to load dashboard data");
      }
    };

    const fetchDashboardAlerts = async () => {
      try {
        const response = await api.get("/dashboard/alerts");
        setDashboardAlerts(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings?.lowStockThreshold !== undefined) {
          setLowStockThreshold(Number(settings.lowStockThreshold) || 5);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const refreshDashboard = () => {
      fetchDashboard();
      fetchDashboardAlerts();
      fetchSettings();
    };

    refreshDashboard();

    const handleSalesUpdated = () => {
      refreshDashboard();
    };

    window.addEventListener('sales:updated', handleSalesUpdated);
    window.addEventListener('inventory:updated', handleSalesUpdated);
    window.addEventListener('settings:updated', handleSalesUpdated);

    return () => {
      window.removeEventListener('sales:updated', handleSalesUpdated);
      window.removeEventListener('inventory:updated', handleSalesUpdated);
      window.removeEventListener('settings:updated', handleSalesUpdated);
    };
  }, []);

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!dashboardData) {
    return <h2>Loading dashboard...</h2>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Welcome to Supermarket MIS</p>

      <div className="stats-container">
        <StatCard
          title="Products"
          value={dashboardData.totalProducts}
          icon={<Package size={24} className="stat-icon" />}
        />

        <StatCard
          title="Low Stock"
          value={dashboardData.inventoryStats?.lowStock ?? 0}
          icon={<AlertTriangle size={24} className="stat-icon" />}
        />

        <StatCard
          title="Out of Stock"
          value={dashboardData.inventoryStats?.outOfStock ?? 0}
          icon={<AlertTriangle size={24} className="stat-icon" />}
        />

        <StatCard
          title="Suppliers"
          value={dashboardData.totalSuppliers}
          icon={<Truck size={24} className="stat-icon" />}
        />

        <StatCard
          title="Customers"
          value={dashboardData.totalCustomers}
          icon={<Users size={24} className="stat-icon" />}
        />

        <StatCard
          title="Today's Sales"
          value={dashboardData.todaySalesCount}
          icon={<ShoppingCart size={24} className="stat-icon" />}
        />

        <StatCard
          title="Today's Revenue"
          value={`TZS ${dashboardData.todayRevenue.toFixed(2)}`}
          icon={<Banknote size={24} className="stat-icon" />}
        />
      </div>

      <StockAlert
        products={Array.isArray(dashboardAlerts?.lowStockProducts) ? dashboardAlerts.lowStockProducts : (Array.isArray(dashboardData?.lowStockProducts) ? dashboardData.lowStockProducts : [])}
        lowStockThreshold={lowStockThreshold}
      />
    </div>
  );
}

export default Dashboard;