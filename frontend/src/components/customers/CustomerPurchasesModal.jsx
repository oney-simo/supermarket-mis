import React, { useEffect, useState } from 'react';
import { getCustomerPurchases } from '../../api/customerApi';

export default function CustomerPurchasesModal({ isOpen, onClose, customer }) {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customer && isOpen) {
      fetchPurchases();
    }
  }, [customer, isOpen]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await getCustomerPurchases(customer._id);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load purchase history', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '650px', maxHeight: '85vh', overflowY: 'auto' }}>
        <h3>Purchase History: {customer.name}</h3>

        {loading ? (
          <p>Loading purchases...</p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
              <div>
                <strong>Total Orders:</strong> {history?.totalOrders || 0}
              </div>
              <div>
                <strong>Total Spent:</strong> TZS {history?.totalSpent?.toFixed(2) || '0.00'}
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Receipt #</th>
                  <th style={{ padding: '8px' }}>Grand Total</th>
                  <th style={{ padding: '8px' }}>Method</th>
                  <th style={{ padding: '8px' }}>Status</th>
                  <th style={{ padding: '8px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {!history?.purchases || history.purchases.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '15px', textAlign: 'center', color: '#6c757d' }}>
                      No purchases found for this customer.
                    </td>
                  </tr>
                ) : (
                  history.purchases.map((sale) => (
                    <tr key={sale._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{sale.receiptNumber}</td>
                      <td style={{ padding: '8px', color: '#28a745', fontWeight: 'bold' }}>TZS {sale.grandTotal?.toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>{sale.paymentMethod}</td>
                      <td style={{ padding: '8px' }}>{sale.paymentStatus}</td>
                      <td style={{ padding: '8px' }}>{new Date(sale.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}