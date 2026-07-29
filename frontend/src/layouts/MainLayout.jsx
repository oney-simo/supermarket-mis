import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/layout.css";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-shell">
      <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

      <div className="app-container">
        <Sidebar sidebarOpen={sidebarOpen} />

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;