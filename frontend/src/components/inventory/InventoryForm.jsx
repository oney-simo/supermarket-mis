import { useState, useEffect } from "react";
import { getProducts } from "../../api/productAPI";
import api from "../../api/axios";
import LoadingSpinner from "../common/LoadingSpinner";

function InventoryForm({ itemToEdit, onSuccess, onCancel }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    product: "",
    batchNumber: "",
    quantity: "",
    manufacturingDate: "",
    expiryDate: "",
    receivedDate: "",
    status: "Available"
  });

  // Pre-fill form data if an item is passed for editing
  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        product: itemToEdit.product?._id || itemToEdit.product || "",
        batchNumber: itemToEdit.batchNumber || "",
        quantity: itemToEdit.quantity || "",
        manufacturingDate: itemToEdit.manufacturingDate ? itemToEdit.manufacturingDate.split("T")[0] : "",
        expiryDate: itemToEdit.expiryDate ? itemToEdit.expiryDate.split("T")[0] : "",
        receivedDate: itemToEdit.receivedDate ? itemToEdit.receivedDate.split("T")[0] : "",
        status: itemToEdit.status || "Available"
      });
    }
  }, [itemToEdit]);

  useEffect(() => {
    const fetchProductsList = async () => {
      try {
        const productsData = await getProducts();
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products for selection.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductsList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (itemToEdit) {
        // Update existing item
        await api.put(`/inventory/${itemToEdit._id}`, formData);
      } else {
        // Create new item
        await api.post("/inventory", formData);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to save inventory batch:", err);
      setError(err.response?.data?.message || "Failed to save inventory batch.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) {
    return <LoadingSpinner text="Loading products..." />;
  }

  return (
    <div className="inventory-form-container">
      <h2>{itemToEdit ? "Edit Inventory Batch" : "Add Inventory Batch"}</h2>
      {error && <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <form onSubmit={handleSubmit} className="inventory-form">
        <div className="form-group">
          <label>Product</label>
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Product --</option>
            {products.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.name} (SKU: {prod.sku})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Batch Number</label>
          <input
            type="text"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
            required
            placeholder="e.g. BATCH-001"
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Manufacturing Date</label>
          <input
            type="date"
            name="manufacturingDate"
            value={formData.manufacturingDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Received Date</label>
          <input
            type="date"
            name="receivedDate"
            value={formData.receivedDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Expired">Expired</option>
            <option value="Damaged">Damaged</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : itemToEdit ? "Update Batch" : "Save Batch"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default InventoryForm;