import { useEffect, useState } from "react";
import api from "../api/axios";

import SearchBar from "../components/products/SearchBar";
import ProductTable from "../components/products/ProductTable";
import AddProductForm from "../components/products/AddProductForm";

import "../styles/products.css";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getProducts } from "../api/productApi";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setShowForm(true);
  };

  // Fetch products from backend
 const fetchProducts = async () => {
    try {
        setLoading(true);

        const response = await getProducts();

        setProducts(response.data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
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
    {loading ? (
    <LoadingSpinner text="Loading products..." />
) : (
    <ProductTable
        products={filteredProducts}
        onDelete={handleDeleteProduct}
        onEdit={handleEditClick}
    />
)}
    </div>
  );
}

export default Products;