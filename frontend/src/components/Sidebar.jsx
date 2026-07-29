import { NavLink } from "react-router-dom";

function Sidebar({ sidebarOpen }) {

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    padding: "8px",
    borderRadius: "5px",
    display: "block",
    backgroundColor: isActive ? "#e5e7eb" : "transparent",
    fontWeight: isActive ? "bold" : "normal"
  });

  return (
    <aside className={sidebarOpen ? "sidebar" : "sidebar collapsed"}>

      {sidebarOpen && (
        <h2>🏪 Supermarket MIS</h2>
      )}

      <nav>

        <NavLink to="/dashboard" style={linkStyle}>
          🏠 {sidebarOpen && "Dashboard"}
        </NavLink>


        {sidebarOpen && <h4>SALES</h4>}

        <NavLink to="/sales" style={linkStyle}>
          🛒 {sidebarOpen && "Sales POS"}
        </NavLink>

        <NavLink to="/customers" style={linkStyle}>
          👥 {sidebarOpen && "Customers"}
        </NavLink>


        {sidebarOpen && <h4>INVENTORY</h4>}

        <NavLink to="/products" style={linkStyle}>
          📦 {sidebarOpen && "Products"}
        </NavLink>

        <NavLink to="/categories" style={linkStyle}>
          🏷️ {sidebarOpen && "Categories"}
        </NavLink>

        <NavLink to="/suppliers" style={linkStyle}>
          🚚 {sidebarOpen && "Suppliers"}
        </NavLink>

        <NavLink to="/purchases" style={linkStyle}>
          📥 {sidebarOpen && "Purchases"}
        </NavLink>

        <NavLink to="/inventory" style={linkStyle}>
          📋 {sidebarOpen && "Inventory"}
        </NavLink>

        <NavLink to="/stock-receiving" style={linkStyle}>
          📥 {sidebarOpen && "Stock Receiving"}
        </NavLink>

        {sidebarOpen && <h4>REPORTS</h4>}

        <NavLink to="/reports" style={linkStyle}>
          📊 {sidebarOpen && "Reports"}
        </NavLink>


        {sidebarOpen && <h4>ADMINISTRATION</h4>}

        <NavLink to="/users" style={linkStyle}>
          👤 {sidebarOpen && "Users"}
        </NavLink>

        <NavLink to="/activity-logs" style={linkStyle}>
          📜 {sidebarOpen && "Activity Logs"}
        </NavLink>

        <NavLink to="/settings" style={linkStyle}>
          ⚙️ {sidebarOpen && "Settings"}
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;