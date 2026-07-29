import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Sidebar({ sidebarOpen }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className={sidebarOpen ? "sidebar" : "sidebar collapsed"}>
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon">
          <span className="material-symbols-outlined">storefront</span>
        </span>
        {sidebarOpen && <span className="sidebar__brand-title">Supermarket MIS</span>}
      </div>

      <nav>
        <NavLink to="/dashboard">
          <span className="material-symbols-outlined">dashboard</span>
          {sidebarOpen && <span className="sidebar__nav-label">Dashboard</span>}
        </NavLink>

        {sidebarOpen && <h4>Sales</h4>}

        <NavLink to="/sales">
          <span className="material-symbols-outlined">point_of_sale</span>
          {sidebarOpen && <span className="sidebar__nav-label">Sales POS</span>}
        </NavLink>

        <NavLink to="/customers">
          <span className="material-symbols-outlined">group</span>
          {sidebarOpen && <span className="sidebar__nav-label">Customers</span>}
        </NavLink>

        {sidebarOpen && <h4>Inventory</h4>}

        <NavLink to="/products">
          <span className="material-symbols-outlined">inventory_2</span>
          {sidebarOpen && <span className="sidebar__nav-label">Products</span>}
        </NavLink>

        <NavLink to="/categories">
          <span className="material-symbols-outlined">category</span>
          {sidebarOpen && <span className="sidebar__nav-label">Categories</span>}
        </NavLink>

        <NavLink to="/suppliers">
          <span className="material-symbols-outlined">local_shipping</span>
          {sidebarOpen && <span className="sidebar__nav-label">Suppliers</span>}
        </NavLink>

        <NavLink to="/purchases">
          <span className="material-symbols-outlined">receipt_long</span>
          {sidebarOpen && <span className="sidebar__nav-label">Purchases</span>}
        </NavLink>

        <NavLink to="/inventory">
          <span className="material-symbols-outlined">warehouse</span>
          {sidebarOpen && <span className="sidebar__nav-label">Inventory</span>}
        </NavLink>

        <NavLink to="/stock-receiving">
          <span className="material-symbols-outlined">move_to_inbox</span>
          {sidebarOpen && <span className="sidebar__nav-label">Stock Receiving</span>}
        </NavLink>

        {sidebarOpen && <h4>Reports</h4>}

        <NavLink to="/reports">
          <span className="material-symbols-outlined">bar_chart</span>
          {sidebarOpen && <span className="sidebar__nav-label">Reports</span>}
        </NavLink>

        {sidebarOpen && <h4>Administration</h4>}

        <NavLink to="/users">
          <span className="material-symbols-outlined">manage_accounts</span>
          {sidebarOpen && <span className="sidebar__nav-label">Users</span>}
        </NavLink>

        <NavLink to="/activity-logs">
          <span className="material-symbols-outlined">history</span>
          {sidebarOpen && <span className="sidebar__nav-label">Activity Logs</span>}
        </NavLink>

        <NavLink to="/settings">
          <span className="material-symbols-outlined">settings</span>
          {sidebarOpen && <span className="sidebar__nav-label">Settings</span>}
        </NavLink>
      </nav>

      <button className="sidebar__logout" type="button" onClick={handleLogout}>
        <span className="material-symbols-outlined">logout</span>
        {sidebarOpen && <span>Logout</span>}
      </button>
    </aside>
  );
}

export default Sidebar;