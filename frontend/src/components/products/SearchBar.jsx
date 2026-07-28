import { useState } from "react";
function SearchBar({ search, setSearch, setShowForm }) {

  return (
    <div className="search-bar">

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={() => setShowForm(true)}>
  + Add Product
</button>

    </div>
  );
}

export default SearchBar;