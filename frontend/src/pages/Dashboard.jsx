import { useEffect, useState } from "react";
import api from "../api/axios";

import StatCard from "../components/dashboard/StatCard";
import StockAlert from "../components/dashboard/StockAlert";
import "../styles/dashboard.css";


function Dashboard() {

  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const response = await api.get("/dashboard/summary");

        setDashboardData(response.data);

      }catch (error) {

  console.log(error);
  setError("Failed to load dashboard data");

}

    };


    fetchDashboard();

  }, []);



  if (error) {
  return (
    <h2>
      {error}
    </h2>
  );
}


if (!dashboardData) {
  return (
    <h2>
      Loading dashboard...
    </h2>
  );
}


  return (

    <div>

      <h1>
        Dashboard
      </h1>


      <p>
        Welcome to Supermarket MIS
      </p>


      <div className="stats-container">

        <StatCard
          title="Products"
          value={dashboardData.totalProducts}
          icon="📦"
        />


        <StatCard
          title="Suppliers"
          value={dashboardData.totalSuppliers}
          icon="🚚"
        />


        <StatCard
          title="Customers"
          value={dashboardData.totalCustomers}
          icon="👥"
        />


        <StatCard
          title="Today's Sales"
          value={dashboardData.todaySalesCount}
          icon="🛒"
        />


        <StatCard
          title="Today's Revenue"
          value={`TZS${dashboardData.todayRevenue.toFixed(2)}`}
          icon="💰"
        />

      </div>



      <StockAlert
        products={dashboardData.lowStockProducts}
      />


    </div>

  );

}


export default Dashboard;