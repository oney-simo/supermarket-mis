import React, { useState, useEffect } from 'react';
import { getStockReceivings, receiveStock } from '../api/stockReceivingAPI';
import { getProducts } from '../api/productApi';
import api from '../api/axios';

export default function StockReceiving() {
  const [records, setRecords] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State matching backend fields
  const [formData, setFormData] = useState({
    purchase: '',
    product: '',
    quantityReceived: 1,
    batchNumber: '',
    manufacturingDate: '',
    expiryDate: '',
    condition: 'Good',
  });

  useEffect(() => {
    fetchRecords();
    fetchOptions();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await getStockReceivings();
      setRecords(data);
      setError(null);
    } catch (err) {
      setError('Failed to load stock receiving records.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      const [purchasesResponse, productsResponse] = await Promise.all([
        api.get('/purchases'),
        getProducts(),
      ]);

      const availablePurchases = (purchasesResponse.data || []).filter((purchase) => {
        const status = purchase.status?.toLowerCase() || '';
        return status !== 'received' && status !== 'completed';
      });

      setPurchases(availablePurchases);
      setProducts(Array.isArray(productsResponse) ? productsResponse : []);
    } catch (err) {
      console.error('Failed to load purchase/product options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await receiveStock(formData);
      fetchRecords();
      setIsModalOpen(false);
      // Reset form
      setFormData({
        purchase: '',
        product: '',
        quantityReceived: 1,
        batchNumber: '',
        manufacturingDate: '',
        expiryDate: '',
        condition: 'Good',
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing stock receipt');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Stock Receiving & Batch Log</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Receive Stock Entry
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading receiving history...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Batch Number</th>
              <th style={{ padding: '12px' }}>Product</th>
              <th style={{ padding: '12px' }}>Purchase ID</th>
              <th style={{ padding: '12px' }}>Quantity</th>
              <th style={{ padding: '12px' }}>Condition</th>
              <th style={{ padding: '12px' }}>Expiry Date</th>
              <th style={{ padding: '12px' }}>Received Date</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  No stock receiving records found.
                </td>
              </tr>
            ) : (
              records.map((rec) => (
                <tr key={rec._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{rec.batchNumber}</td>
                  <td style={{ padding: '12px' }}>{rec.product?.name || rec.product}</td>
                  <td style={{ padding: '12px' }}>{rec.purchase?._id || rec.purchase}</td>
                  <td style={{ padding: '12px' }}>{rec.quantityReceived}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: rec.condition === 'Good' ? '#d4edda' : '#f8d7da',
                      color: rec.condition === 'Good' ? '#155724' : '#721c24'
                    }}>
                      {rec.condition}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{rec.expiryDate ? new Date(rec.expiryDate).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '12px' }}>{new Date(rec.receivedDate || rec.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Receive Stock Modal Form */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>Receive Shipment Batch</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Purchase *</label>
                <select
                  required
                  value={formData.purchase}
                  onChange={(e) => setFormData({ ...formData, purchase: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  disabled={loadingOptions}
                >
                  <option value="">-- Select Purchase --</option>
                  {purchases.map((purchase) => {
                    const supplierName = purchase.supplier?.name || purchase.supplier?.companyName || 'Unknown supplier';
                    const label = purchase.invoiceNumber
                      ? `${purchase.invoiceNumber} · ${supplierName}`
                      : `${purchase._id} · ${supplierName}`;

                    return (
                      <option key={purchase._id} value={purchase._id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product *</label>
                <select
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  disabled={loadingOptions}
                >
                  <option value="">-- Select Product --</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quantity Received *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantityReceived}
                  onChange={(e) => setFormData({ ...formData, quantityReceived: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Batch Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BATCH-2026-001"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Manufacturing Date</label>
                <input
                  type="date"
                  value={formData.manufacturingDate}
                  onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="Good">Good</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Submit Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}