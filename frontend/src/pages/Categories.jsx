import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory, getProductsByCategory } from "../api/categoryApi";
import LoadingSpinner from "../components/common/LoadingSpinner";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  // View products modal state
  const [viewingCategory, setViewingCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setShowForm(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name || "", description: category.description || "" });
    setShowForm(true);
  };

  const handleViewProducts = async (category) => {
    setViewingCategory(category);
    setLoadingProducts(true);
    try {
      const data = await getProductsByCategory(category._id);
      setCategoryProducts(data);
    } catch (err) {
      console.error("Failed to fetch products for category:", err);
      setCategoryProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
      } else {
        await createCategory(formData);
      }
      setShowForm(false);
      loadCategories();
    } catch (err) {
      console.error("Failed to save category:", err);
      setError(err.response?.data?.message || "Failed to save category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (err) {
        console.error("Failed to delete category:", err);
        setError("Failed to delete category.");
      }
    }
  };

  if (loading && categories.length === 0) {
    return <LoadingSpinner text="Loading categories..." />;
  }

  return (
    <div className="categories-page" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Category Management</h2>
        <button onClick={handleOpenAdd} style={{ padding: "8px 15px", cursor: "pointer" }}>
          + Add Category
        </button>
      </div>

      {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

      {showForm && (
        <div style={{ background: "#f9f9f9", padding: "15px", marginBottom: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3>{editingCategory ? "Edit Category" : "Add New Category"}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <button type="submit" disabled={submitting} style={{ marginRight: "10px", padding: "6px 12px", cursor: "pointer" }}>
              {submitting ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: "6px 12px", cursor: "pointer" }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }} border="1">
        <thead>
          <tr style={{ background: "#f1f1f1" }}>
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Description</th>
            <th style={{ padding: "10px", textAlign: "center" }}>Products Count</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>No categories found.</td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat._id}>
                <td style={{ padding: "10px" }}>{cat.name}</td>
                <td style={{ padding: "10px" }}>{cat.description || "-"}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {cat.productCount || 0}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <button onClick={() => handleViewProducts(cat)} style={{ marginRight: "5px", cursor: "pointer" }}>👁️ View</button>
                  <button onClick={() => handleOpenEdit(cat)} style={{ marginRight: "5px", cursor: "pointer" }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(cat._id)} style={{ cursor: "pointer", color: "red" }}>🗑 Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* View Products Modal */}
      {viewingCategory && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "5px", width: "500px", maxHeight: "80vh", overflowY: "auto" }}>
            <h3>Products in "{viewingCategory.name}"</h3>
            {loadingProducts ? (
              <p>Loading products...</p>
            ) : categoryProducts.length === 0 ? (
              <p>No products found in this category.</p>
            ) : (
              <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
  {categoryProducts.map((prod) => (
    <li key={prod._id} style={{ marginBottom: "8px" }}>
      <strong>{prod.name}</strong> - Stock: {prod.stockQuantity ?? prod.stock ?? prod.quantity ?? prod.stockLevel ?? 0} | Price: ${prod.price ?? prod.retailPrice ?? prod.sellingPrice ?? 0}
    </li>
  ))}
</ul>
            )}
            <button onClick={() => setViewingCategory(null)} style={{ padding: "6px 12px", cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;