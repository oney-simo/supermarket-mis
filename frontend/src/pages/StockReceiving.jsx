import React, { useState, useEffect } from 'react';
import { getStockReceivings, receiveStock } from '../api/stockReceivingAPI';
import { getProducts } from '../api/productService';
import api from '../api/axios';
import Modal from '../components/common/Modal';
import '../styles/stockReceiving.css';

export default function StockReceiving() {
  const [records, setRecords] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
    fetchOptions();
  };

  const handlePurchaseChange = async (purchaseId) => {
    const nextPurchase = purchaseId || '';

    setFormData((prev) => ({ ...prev, purchase: nextPurchase, product: '' }));
    setPurchaseItems([]);

    if (!nextPurchase) {
      return;
    }

    try {
      const response = await api.get(`/purchases/${nextPurchase}`);
      const payload = response?.data || {};
      const items = Array.isArray(payload.items)
        ? payload.items
        : Array.isArray(payload.purchase?.items)
          ? payload.purchase.items
          : [];
      setPurchaseItems(items);

      if (items.length === 1) {
        const productId = items[0]?.product?._id || items[0]?.product || '';
        setFormData((prev) => ({ ...prev, purchase: nextPurchase, product: productId }));
      } else {
        setFormData((prev) => ({ ...prev, purchase: nextPurchase, product: '' }));
      }
    } catch (err) {
      console.error('Failed to load purchase items:', err);
      setPurchaseItems([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await receiveStock(formData);
      await Promise.all([fetchRecords(), fetchOptions()]);
      setIsModalOpen(false);
      setFormData({
        purchase: '',
        product: '',
        quantityReceived: 1,
        batchNumber: '',
        manufacturingDate: '',
        expiryDate: '',
        condition: 'Good',
      });
      setPurchaseItems([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing stock receipt');
    }
  };

  return (
    <div className="stock-receiving-page">
      <div className="stock-receiving-header">
        <div>
          <h2 className="stock-receiving-title">Stock Receiving & Batch Log</h2>
          <p className="stock-receiving-subtitle">Purchases are marked as received automatically when stock is logged.</p>
        </div>
        <button className="btn btn--blue" onClick={handleOpenModal}>
          <span className="material-symbols-outlined">move_to_inbox</span> Receive Stock Entry
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading receiving history...</p>
      ) : (
        <div className="stock-receiving-table-wrap">
          <table className="stock-receiving-table">
            <thead>
              <tr>
                <th>Batch Number</th>
                <th>Product</th>
                <th>Purchase ID</th>
                <th>Quantity</th>
                <th>Condition</th>
                <th>Expiry Date</th>
                <th>Received Date</th>
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
                  <tr key={rec._id}>
                    <td style={{ fontWeight: 700 }}>{rec.batchNumber}</td>
                    <td>{rec.product?.name || rec.product}</td>
                    <td>{rec.purchase?._id || rec.purchase}</td>
                    <td>{rec.quantityReceived}</td>
                    <td>
                      <span className={`stock-receiving-badge ${rec.condition === 'Good' ? 'stock-receiving-badge--good' : 'stock-receiving-badge--damaged'}`}>
                        {rec.condition}
                      </span>
                    </td>
                    <td>{rec.expiryDate ? new Date(rec.expiryDate).toLocaleDateString() : '—'}</td>
                    <td>{new Date(rec.receivedDate || rec.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title="Receive shipment batch"
        subtitle="This updates stock inventory and marks the linked purchase as received automatically."
        onClose={() => setIsModalOpen(false)}
        footer={
          <div className="stock-receiving-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn--green" form="stock-receiving-form">
              Submit Receipt
            </button>
          </div>
        }
      >
        <form id="stock-receiving-form" onSubmit={handleSubmit} className="stock-receiving-form">
          <div>
            <label>Purchase *</label>
            <select
              required
              value={formData.purchase}
              onChange={(e) => handlePurchaseChange(e.target.value)}
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

          <div>
            <label>Product *</label>
            <select
              required
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              disabled={loadingOptions || !formData.purchase}
            >
              <option value="">{formData.purchase ? '-- Select Product from this purchase --' : '-- Select Purchase first --'}</option>
              {purchaseItems.length > 0
                ? purchaseItems.map((item) => {
                    const productId = item.product?._id || item.product;
                    const productName = item.product?.name || item.productName || 'Unknown product';
                    const sku = item.product?.sku || '';
                    return (
                      <option key={productId} value={productId}>
                        {productName}{sku ? ` (${sku})` : ''}
                      </option>
                    );
                  })
                : products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
            </select>
            {formData.purchase && purchaseItems.length > 0 && (
              <small style={{ display: 'block', marginTop: '6px', color: '#6b7280' }}>
                This purchase includes the products above. Select the item you want to receive.
              </small>
            )}
          </div>

          <div>
            <label>Quantity Received *</label>
            <input
              type="number"
              min="1"
              required
              value={formData.quantityReceived}
              onChange={(e) => setFormData({ ...formData, quantityReceived: Number(e.target.value) })}
            />
          </div>

          <div>
            <label>Batch Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. BATCH-2026-001"
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
            />
          </div>

          <div>
            <label>Manufacturing Date</label>
            <input
              type="date"
              value={formData.manufacturingDate}
              onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
            />
          </div>

          <div>
            <label>Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>

          <div>
            <label>Condition</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            >
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
