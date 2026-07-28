import { useEffect, useState } from "react";
import api from "../api/axios";

import SearchBar from "../components/products/SearchBar";
import ProductTable from "../components/products/ProductTable";
import AddProductForm from "../components/products/AddProductForm";

import "../styles/products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Load products when page opens
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">

      <div className="products-header">
        <h1>Products</h1>
        <p>Manage supermarket products</p>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        setShowForm={setShowForm}
      />

      {showForm && (
        <AddProductForm
          onProductAdded={() => {
            fetchProducts();
            setShowForm(false);
          }}
        />
      )}

      <ProductTable products={filteredProducts} />

    </div>
  );
}

export default Products;