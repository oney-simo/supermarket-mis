function Navbar({ setSidebarOpen, sidebarOpen }) {

  return (
    <header className="navbar">

      <div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <h2>
          🏪 Supermarket MIS
        </h2>
      </div>


      <div>
        🔔 Admin
      </div>

    </header>
  );
}

export default Navbar;