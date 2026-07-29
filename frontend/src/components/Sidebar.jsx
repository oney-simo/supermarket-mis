import { NavLink } from "react-router-dom";

function Sidebar({ sidebarOpen }) {
  return (
    <aside className={sidebarOpen ? "sidebar" : "sidebar collapsed"}>
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon">🏪</span>
        {sidebarOpen && <span className="sidebar__brand-title">Supermarket MIS</span>}
      </div>

      <nav>
        <NavLink to="/dashboard">
          <span>🏠</span>
          {sidebarOpen && <span className="sidebar__nav-label">Dashboard</span>}
        </NavLink>

        {sidebarOpen && <h4>Sales</h4>}

        <NavLink to="/sales">
          <span>🛒</span>
          {sidebarOpen && <span className="sidebar__nav-label">Sales POS</span>}
        </NavLink>

        <NavLink to="/customers">
          <span>👥</span>
          {sidebarOpen && <span className="sidebar__nav-label">Customers</span>}
        </NavLink>

        {sidebarOpen && <h4>Inventory</h4>}

        <NavLink to="/products">
          <span>📦</span>
          {sidebarOpen && <span className="sidebar__nav-label">Products</span>}
        </NavLink>

        <NavLink to="/categories">
          <span>🏷️</span>
          {sidebarOpen && <span className="sidebar__nav-label">Categories</span>}
        </NavLink>

        <NavLink to="/suppliers">
          <span>🚚</span>
          {sidebarOpen && <span className="sidebar__nav-label">Suppliers</span>}
        </NavLink>

        <NavLink to="/purchases">
          <span>📥</span>
          {sidebarOpen && <span className="sidebar__nav-label">Purchases</span>}
        </NavLink>

        <NavLink to="/inventory">
          <span>📋</span>
          {sidebarOpen && <span className="sidebar__nav-label">Inventory</span>}
        </NavLink>

        <NavLink to="/stock-receiving">
          <span>📥</span>
          {sidebarOpen && <span className="sidebar__nav-label">Stock Receiving</span>}
        </NavLink>

        {sidebarOpen && <h4>Reports</h4>}

        <NavLink to="/reports">
          <span>📊</span>
          {sidebarOpen && <span className="sidebar__nav-label">Reports</span>}
        </NavLink>

        {sidebarOpen && <h4>Administration</h4>}

        <NavLink to="/users">
          <span>👤</span>
          {sidebarOpen && <span className="sidebar__nav-label">Users</span>}
        </NavLink>

        <NavLink to="/activity-logs">
          <span>📜</span>
          {sidebarOpen && <span className="sidebar__nav-label">Activity Logs</span>}
        </NavLink>

        <NavLink to="/settings">
          <span>⚙️</span>
          {sidebarOpen && <span className="sidebar__nav-label">Settings</span>}
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;