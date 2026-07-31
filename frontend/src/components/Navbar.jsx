import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar({ setSidebarOpen, sidebarOpen }) {
  const { role } = useContext(AuthContext);
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Guest';

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          className="navbar__toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <h2 className="navbar__title">
          <span className="material-symbols-outlined">storefront</span> Supermarket MIS
        </h2>
      </div>

      <div className="navbar__right">
        <span className="status-pill">
          <span className="material-symbols-outlined">notifications_active</span> {displayRole}
        </span>
      </div>
    </header>
  );
}

export default Navbar;