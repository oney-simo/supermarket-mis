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
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Stock Batch"}
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="inventory-stats" style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <div 
          onClick={() => setStatusFilter("Available")} 
          style={{ border: "1px solid #ccc", padding: "15px", flex: "1", cursor: "pointer", textAlign: "center" }}
        >
          <div>Available</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>{stats.available}</div>
        </div>

        <div 
          onClick={() => setStatusFilter("Low Stock")} 
          style={{ border: "1px solid #ccc", padding: "15px", flex: "1", cursor: "pointer", textAlign: "center" }}
        >
          <div>Low Stock</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>{stats.lowStock}</div>
        </div>

        <div 
          onClick={() => setStatusFilter("Expired")} 
          style={{ border: "1px solid #ccc", padding: "15px", flex: "1", cursor: "pointer", textAlign: "center" }}
        >
          <div>Expired</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>{stats.expired}</div>
        </div>

        <div 
          onClick={() => setStatusFilter("Damaged")} 
          style={{ border: "1px solid #ccc", padding: "15px", flex: "1", cursor: "pointer", textAlign: "center" }}
        >
          <div>Damaged</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>{stats.damaged}</div>
        </div>
      </div>

      {showForm && (
        <div style={{ marginBottom: "20px" }}>
          <InventoryForm 
            onSuccess={handleFormSuccess} 
            onCancel={() => setShowForm(false)} 
          />
        </div>
      )}

      <div className="inventory-controls" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search Product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", flex: "1" }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="All">All Statuses ▼</option>
          <option value="Available">Available</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Expired">Expired</option>
          <option value="Damaged">Damaged</option>
          <option value="Reserved">Reserved</option>
        </select>
      </div>

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;