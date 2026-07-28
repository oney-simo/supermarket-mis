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
  const [productToEdit, setProductToEdit] = useState(null);

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setShowForm(true);
  };

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
  
// Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.log("Delete failed:", error);
      alert("Failed to delete product.");
    }
  };
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
        setShowForm={() => {
          setProductToEdit(null);
          setShowForm(true);
        }}
      />

     {showForm && (
        <AddProductForm
          productToEdit={productToEdit}
          onProductSaved={() => {
            fetchProducts();
            setShowForm(false);
            setProductToEdit(null);
          }}
        />
      )}
     <ProductTable
        products={filteredProducts}
        onDelete={handleDeleteProduct}
        onEdit={handleEditClick}
      />

    </div>
  );
}

export default Products;