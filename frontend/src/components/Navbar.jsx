function Navbar({ setSidebarOpen, sidebarOpen }) {
  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          className="navbar__toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <h2 className="navbar__title">🏪 Supermarket MIS</h2>
      </div>

      <div className="navbar__right">
        <span className="status-pill">🔔 Admin</span>
      </div>
    </header>
  );
}

export default Navbar;