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

  const filteredInventory = inventory.filter((item) => {
    // Adjust properties based on your backend response structure
    const productName = item.product?.name || "";
    const sku = item.product?.sku || "";
    
    const matchesSearch = 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

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
        {/* Your existing header title/p tags stay here */}
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Stock Batch"}
        </button>
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