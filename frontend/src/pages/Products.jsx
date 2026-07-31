import { useEffect, useState } from "react";
import api from "../api/axios";

import SearchBar from "../components/products/SearchBar";
import ProductTable from "../components/products/ProductTable";
import AddProductForm from "../components/products/AddProductForm";
import Modal from "../components/common/Modal";

import "../styles/products.css";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getProducts } from "../api/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setShowForm(true);
  };

  // Fetch products from backend
 const fetchProducts = async () => {
    try {
        setLoading(true);

        const productsData = await getProducts();

        setProducts(Array.isArray(productsData) ? productsData : []);
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
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      setDeleteTarget(null);
    } catch (error) {
      console.log("Delete failed:", error);
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

      <Modal
        isOpen={showForm}
        title={productToEdit ? "Edit Product" : "Add Product"}
        subtitle={productToEdit ? "Update the selected product details." : "Create a new product entry for the catalog."}
        onClose={() => {
          setShowForm(false);
          setProductToEdit(null);
        }}
      >
        <AddProductForm
          productToEdit={productToEdit}
          onProductSaved={() => {
            fetchProducts();
            setShowForm(false);
            setProductToEdit(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setProductToEdit(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={Boolean(deleteTarget)}
        title="Delete product"
        subtitle="This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button className="btn btn--blue" type="button" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button
              className="btn btn--red"
              type="button"
              onClick={() => {
                handleDeleteProduct(deleteTarget);
              }}
            >
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to remove this product from the inventory?</p>
      </Modal>

    {loading ? (
    <LoadingSpinner text="Loading products..." />
) : (
    <ProductTable
        products={filteredProducts}
        onDelete={setDeleteTarget}
        onEdit={handleEditClick}
    />
)}
    </div>
  );
}

export default Products;
