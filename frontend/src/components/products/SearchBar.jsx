function SearchBar({ search, setSearch, setShowForm }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="btn btn--green" onClick={() => setShowForm(true)}>
        + Add Product
      </button>
    </div>
  );
}

export default SearchBar;