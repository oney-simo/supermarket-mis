function Navbar({ setSidebarOpen, sidebarOpen }) {
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
          <span className="material-symbols-outlined">notifications_active</span> Admin
        </span>
      </div>
    </header>
  );
}

export default Navbar;