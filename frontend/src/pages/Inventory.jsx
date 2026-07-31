import { useEffect, useState, useCallback } from "react";
import { fetchInventory } from "../api/inventoryService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import "../styles/inventory.css";

import InventoryForm from "../components/inventory/InventoryForm";
import { getSettings } from "../api/settingsApi";
import { getInventoryStockStatus } from "../utils/stockStatus";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingItem, setEditingItem] = useState(null);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);

  const loadInventoryData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchInventory();
      setInventory(data || []);
    } catch (error) {
      console.error("Inventory error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const settings = await getSettings();
      if (settings?.lowStockThreshold !== undefined) {
        setLowStockThreshold(Number(settings.lowStockThreshold) || 5);
      }
    } catch (error) {
      console.error("Settings error:", error);
    }
  }, []);

  useEffect(() => {
    loadInventoryData();
    loadSettings();

    const handleSettingsUpdated = () => {
      loadSettings();
      loadInventoryData();
    };

    const handleInventoryUpdated = () => loadInventoryData();
    const handleSalesUpdated = () => loadInventoryData();

    window.addEventListener("settings:updated", handleSettingsUpdated);
    window.addEventListener("inventory:updated", handleInventoryUpdated);
    window.addEventListener("sales:updated", handleSalesUpdated);

    return () => {
      window.removeEventListener("settings:updated", handleSettingsUpdated);
      window.removeEventListener("inventory:updated", handleInventoryUpdated);
      window.removeEventListener("sales:updated", handleSalesUpdated);
    };
  }, [loadInventoryData, loadSettings]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAddNewBatch = () => {
    setEditingItem(null); // Clear editing item for new entry
    setShowForm((prev) => !prev);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingItem(null); // Reset edit state after successful submit
    await loadInventoryData();
    window.dispatchEvent(new Event("inventory:updated"));
  };

  const getStockAlert = (item) => {
    if (!item.product) return "In Stock";
    return getInventoryStockStatus(item, new Date(), lowStockThreshold);
  };

  const stats = {
    available: inventory.filter((item) => getStockAlert(item) === "In Stock").length,
    lowStock: inventory.filter((item) => getStockAlert(item) === "Low Stock").length,
    outOfStock: inventory.filter((item) => getStockAlert(item) === "Out of Stock").length,
    expired: inventory.filter((item) => getStockAlert(item) === "Expired").length,
    damaged: inventory.filter((item) => item.status === "Damaged").length,
  };

  const filteredInventory = inventory.filter((item) => {
    const productName = item.product?.name || "";
    const sku = item.product?.sku || "";
    const batchNumber = item.batchNumber || "";

    const matchesSearch =
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedStatusFilter =
      statusFilter === "Available" || statusFilter === "In Stock" ? "In Stock" : statusFilter;

    const matchesStatus =
      normalizedStatusFilter === "All" ||
      getStockAlert(item) === normalizedStatusFilter ||
      item.status === normalizedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner text="Loading inventory..." />;
  }

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <h1>Inventory</h1>
        <p>Monitor stock levels, batches and expiry dates.</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button className="btn btn--blue" onClick={handleAddNewBatch}>
          {showForm ? "Cancel" : "+ Add Stock Batch"}
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="inventory-stats">
        <div className="inventory-stat-card" onClick={() => setStatusFilter("In Stock")}>
          <div className="inventory-stat-card__label">In Stock</div>
          <div className="inventory-stat-card__value">{stats.available}</div>
        </div>

        <div className="inventory-stat-card" onClick={() => setStatusFilter("Low Stock")}>
          <div className="inventory-stat-card__label">Low Stock</div>
          <div className="inventory-stat-card__value">{stats.lowStock}</div>
        </div>

        <div className="inventory-stat-card" onClick={() => setStatusFilter("Out of Stock")}>
          <div className="inventory-stat-card__label">Out of Stock</div>
          <div className="inventory-stat-card__value">{stats.outOfStock}</div>
        </div>

        <div className="inventory-stat-card" onClick={() => setStatusFilter("Expired")}>
          <div className="inventory-stat-card__label">Expired</div>
          <div className="inventory-stat-card__value">{stats.expired}</div>
        </div>

        <div className="inventory-stat-card" onClick={() => setStatusFilter("Damaged")}>
          <div className="inventory-stat-card__label">Damaged</div>
          <div className="inventory-stat-card__value">{stats.damaged}</div>
        </div>
      </div>

      {showForm && (
        <div style={{ marginBottom: "20px" }}>
          <InventoryForm
            itemToEdit={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      <div className="inventory-controls">
        <input
          type="text"
          placeholder="Search Product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="inventory-search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="inventory-status-select"
        >
          <option value="All">All Statuses ▼</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Expired">Expired</option>
          <option value="Damaged">Damaged</option>
          <option value="Reserved">Reserved</option>
        </select>
      </div>

      <div className="inventory-table-wrap">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Batch</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Buying Price</th>
              <th>Expiry Date</th>
              <th>Item Status</th>
              <th>Stock Alert</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                  No inventory items found.
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => (
                <tr key={item._id}>
                  <td>{item.product?.name || "N/A"}</td>
                  <td>{item.product?.sku || "N/A"}</td>
                  <td>{item.batchNumber || "N/A"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.product?.unit || "-"}</td>
                  <td>{item.product?.buyingPrice || "-"}</td>
                  <td>
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString()
                      : "No expiry"}
                  </td>
                  <td>{item.status || "Available"}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#fff",
                        backgroundColor:
                          getStockAlert(item) === "Out of Stock"
                            ? "#dc2626"
                            : getStockAlert(item) === "Low Stock"
                            ? "#f59e0b"
                            : getStockAlert(item) === "Expired"
                            ? "#b91c1c"
                            : "#16a34a",
                      }}
                    >
                      {getStockAlert(item)}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn--green" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
