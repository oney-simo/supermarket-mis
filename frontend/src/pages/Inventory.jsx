import { useEffect, useState } from "react";
import { fetchInventory } from "../api/inventoryService"; // Use your service!
import LoadingSpinner from "../components/common/LoadingSpinner";
import "../styles/inventory.css";

import InventoryForm from "../components/inventory/InventoryForm";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingItem, setEditingItem] = useState(null);


  // edit handleEdit function to set the item to be edited and show the form
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true); // Reuse your form or open the modal/form view
  };

  // Defined first so it can be safely used by stats and filters
  const getStockAlert = (item) => {
    if (!item.product) return "";

    if (item.quantity === 0) {
      return "Out of Stock";
    }

    if (item.quantity <= item.product.reorderLevel) {
      return "Low Stock";
    }

    return "Normal";
  };

  const stats = {
    available: inventory.filter(item => item.status === "Available").length,
    lowStock: inventory.filter(item => getStockAlert(item) === "Low Stock").length,
    expired: inventory.filter(item => item.status === "Expired").length,
    damaged: inventory.filter(item => item.status === "Damaged").length,
  };

  const filteredInventory = inventory.filter((item) => {
    const productName = item.product?.name || "";
    const sku = item.product?.sku || "";
    
    const matchesSearch = 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Handle statusFilter matching either direct status or stock alert type
    const matchesStatus = 
      statusFilter === "All" || 
      item.status === statusFilter || 
      (statusFilter === "Low Stock" && getStockAlert(item) === "Low Stock");

    return matchesSearch && matchesStatus;
  });

  const handleFormSuccess = () => {
    setShowForm(false); // Close the form
    loadInventoryData(); // Call your existing data loading function to refresh the table
  };

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const data = await fetchInventory(); // Calls GET /inventory correctly
      setInventory(data);
    } catch (error) {
      console.error("Inventory error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryData();
  }, []);

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
        <button className="btn btn--blue" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Stock Batch"}
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="inventory-stats">
        <div className="inventory-stat-card" onClick={() => setStatusFilter("Available") }>
          <div className="inventory-stat-card__label">Available</div>
          <div className="inventory-stat-card__value">{stats.available}</div>
        </div>

        <div className="inventory-stat-card" onClick={() => setStatusFilter("Low Stock") }>
          <div className="inventory-stat-card__label">Low Stock</div>
          <div className="inventory-stat-card__value">{stats.lowStock}</div>
        </div>

        <div className="inventory-stat-card" onClick={() => setStatusFilter("Expired") }>
          <div className="inventory-stat-card__label">Expired</div>
          <div className="inventory-stat-card__value">{stats.expired}</div>
        </div>

        <div className="inventory-stat-card" onClick={() => setStatusFilter("Damaged") }>
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
          <option value="Available">Available</option>
          <option value="Low Stock">Low Stock</option>
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
            <th>Status</th>
            <th>Stock Alert</th>
            <th>Action</th>
          </tr>
        </thead>
       <tbody>
          {filteredInventory.map((item) => (
            <tr key={item._id}>
              <td>{item.product?.name}</td>
              <td>{item.product?.sku}</td>
              <td>{item.batchNumber}</td>
              <td>{item.quantity}</td>
              <td>{item.product?.unit}</td>
              <td>{item.product?.buyingPrice}</td>
              <td>
                {item.expiryDate
                  ? new Date(item.expiryDate).toLocaleDateString()
                  : "No expiry"}
              </td>
              <td>{item.status}</td>
              <td>{getStockAlert(item)}</td>
              <td>
                <button 
                  className="btn btn--green"
                  onClick={() => handleEdit(item)} 
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default Inventory;