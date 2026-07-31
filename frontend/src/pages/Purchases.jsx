import React, { useState, useEffect } from 'react';
import { getPurchases, createPurchase } from '../api/purchaseApi';
import { getProducts } from '../api/productApi';
import { getSuppliers } from '../api/supplierAPI';

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplier: '',
    invoiceNumber: '',
    purchaseDate: new Date().toISOString().slice(0, 10),
    status: 'Pending',
    paymentStatus: 'Unpaid',
    notes: '',
    items: [
      {
        product: '',
        quantity: 1,
        buyingPrice: 0
      }
    ]
  });

  useEffect(() => {
    fetchPurchases();
    fetchOptions();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await getPurchases();
      setPurchases(data);
      setError(null);
    } catch (err) {
      setError('Failed to load purchase orders.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      const [suppliersData, productsData] = await Promise.all([
        getSuppliers(),
        getProducts()
      ]);

      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error(err);
      setSuppliers([]);
      setProducts([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = {
        ...nextItems[index],
        [field]: field === 'quantity' ? Number(value) : value
      };

      if (field === 'product') {
        const selectedProduct = products.find((item) => item._id === value);
        nextItems[index].buyingPrice = selectedProduct?.buyingPrice ?? 0;
      }

      return { ...prev, items: nextItems };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, buyingPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index)
    }));
  };

  const computeTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity || 0) * (item.buyingPrice || 0);
    }, 0);
  };

  const resetForm = () => {
    setFormData({
      supplier: '',
      invoiceNumber: '',
      purchaseDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      paymentStatus: 'Unpaid',
      notes: '',
      items: [
        {
          product: '',
          quantity: 1,
          buyingPrice: 0
        }
      ]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.supplier || !formData.invoiceNumber || formData.items.length === 0) {
      setError('Supplier, invoice number, and at least one purchase item are required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        totalAmount: computeTotal(),
        items: formData.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          buyingPrice: item.buyingPrice
        }))
      };

      await createPurchase(payload);
      await fetchPurchases();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create purchase order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1>Purchases</h1>
          <p>Manage stock purchases and supplier transactions.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
            setError(null);
          }}
          style={{ padding: '10px 18px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          + New Purchase Order
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '24px', padding: '18px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#ffffff' }}>
          <h2 style={{ marginBottom: '16px' }}>Create Purchase Order</h2>
          {error && <div style={{ marginBottom: '12px', color: '#b91c1c' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Supplier</label>
                <select
                  value={formData.supplier}
                  onChange={(e) => handleFormChange('supplier', e.target.value)}
                  disabled={loadingOptions}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name || supplier.companyName || supplier._id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Invoice Number</label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleFormChange('invoiceNumber', e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Purchase Date</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleFormChange('purchaseDate', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Payment Status</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => handleFormChange('paymentStatus', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Received">Received</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h3 style={{ marginBottom: '12px' }}>Purchase Items</h3>
              {formData.items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Product</label>
                    <select
                      value={item.product}
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Buy Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.buyingPrice}
                      onChange={(e) => handleItemChange(index, 'buyingPrice', e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Subtotal</label>
                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      {(item.quantity * item.buyingPrice).toFixed(2)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    style={{ padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addItem}
                style={{ padding: '10px 15px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                + Add Item
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <strong>Total Amount: {'TZS ' + computeTotal().toFixed(2)}</strong>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ padding: '10px 18px', backgroundColor: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {submitting ? 'Saving...' : 'Save Purchase'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 style={{ marginBottom: '14px' }}>Purchase Orders</h2>
        {loading ? (
          <p>Loading purchase orders...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Invoice</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Supplier</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Purchase Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Payment</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '18px', textAlign: 'center', color: '#6b7280' }}>
                      No purchase orders found.
                    </td>
                  </tr>
                ) : (
                  purchases.map((purchase) => {
                    const supplierLabel = purchase.supplier && (purchase.supplier.name || purchase.supplier.companyName)
                      ? (purchase.supplier.name || purchase.supplier.companyName)
                      : 'Unknown';
                    const totalLabel = purchase.totalAmount ? 'TZS ' + purchase.totalAmount.toFixed(2) : 'TZS 0.00';

                    return (
                      <tr key={purchase._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px' }}>{purchase.invoiceNumber}</td>
                        <td style={{ padding: '12px' }}>{supplierLabel}</td>
                        <td style={{ padding: '12px' }}>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>{purchase.status}</td>
                        <td style={{ padding: '12px' }}>{purchase.paymentStatus}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>{totalLabel}</td>
                        <td style={{ padding: '12px' }}>{purchase.notes || '—'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Purchases;