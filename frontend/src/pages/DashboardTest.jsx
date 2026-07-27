import { useEffect, useState } from "react";
import api from "../api/axios";

function DashboardTest() {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <h1>Dashboard Test</h1>

      {data ? (
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}

    </div>
  );
}

export default DashboardTest;