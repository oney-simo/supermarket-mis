import React, { useState } from 'react';
import CartItemRow from './CartItemRow';
import { createSale } from '../../api/salesApi';

export default function POSModal({ isOpen, onClose, products, customers, onSuccess }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState('');
  const [saleItems, setSaleItems] = useState([{ product: '', quantity: 1, unitPrice: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleItemChange = (index, field, value) => {
    const newItems = [...saleItems];
    newItems[index][field] = value;

    if (field === 'product') {
      const selectedProduct = products.find((p) => p._id === value);
      if (selectedProduct) {
        newItems[index].unitPrice = selectedProduct.sellingPrice || selectedProduct.price || 0;
      }
    }

    setSaleItems(newItems);
  };

  const addSaleItemRow = () => {
    setSaleItems([...saleItems, { product: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeSaleItemRow = (index) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () =>
    saleItems.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0);

  const calculateGrandTotal = () =>
    calculateSubtotal() - Number(discount) + Number(tax);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const receiptNumber = `REC-${Date.now().toString().slice(-6)}`;

      // Find selected customer name or default to Walk-in
      const matchedCustomer = customers?.find((c) => c._id === selectedCustomerId);
      const customerName = matchedCustomer ? matchedCustomer.name : 'Walk-in Customer';

      const payload = {
        receiptNumber,
        customer: selectedCustomerId || null, // Sends the MongoDB _id for relationship lookup
        customerName,
        paymentMethod,
        discount: Number(discount),
        tax: Number(tax),
        notes,
        items: saleItems.map((item) => ({
          product: item.product,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      };

      await createSale(payload);
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
      window.dispatchEvent(new Event('sales:updated'));
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>New POS Checkout</h3>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Walk-in Customer (General)</option>
                {customers && customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Mobile Money">Mobile Money</option>
              </select>
            </div>
          </div>

          <h4 style={{ marginBottom: '10px', marginTop: '20px' }}>Cart Items</h4>
          {saleItems.map((item, index) => (
            <CartItemRow
              key={index}
              item={item}
              index={index}
              products={products}
              onChange={handleItemChange}
              onRemove={removeSaleItemRow}
              canRemove={saleItems.length > 1}
            />
          ))}

          <button
            type="button"
            onClick={addSaleItemRow}
            style={{ padding: '6px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}
          >
            + Add Another Item
          </button>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Discount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tax</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              rows="2"
            />
          </div>

          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'right', color: '#28a745' }}>
            Grand Total: TZS {calculateGrandTotal().toFixed(2)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {submitting ? 'Processing...' : 'Complete Checkout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}