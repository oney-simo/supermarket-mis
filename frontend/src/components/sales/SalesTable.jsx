import React from 'react';

export default function SalesTable({ sales, loading }) {
  if (loading) return <p>Loading sales history...</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
      <thead>
        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
          <th style={{ padding: '12px' }}>Receipt #</th>
          <th style={{ padding: '12px' }}>Customer</th>
          <th style={{ padding: '12px' }}>Grand Total</th>
          <th style={{ padding: '12px' }}>Payment Method</th>
          <th style={{ padding: '12px' }}>Status</th>
          <th style={{ padding: '12px' }}>Date</th>
        </tr>
      </thead>
      <tbody>
        {sales.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
              No sales recorded yet.
            </td>
          </tr>
        ) : (
          sales.map((sale) => (
            <tr key={sale._id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{sale.receiptNumber}</td>
              <td style={{ padding: '12px' }}>{sale.customerName}</td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#28a745' }}>
                TZS {sale.grandTotal?.toFixed(2)}
              </td>
              <td style={{ padding: '12px' }}>{sale.paymentMethod}</td>
              <td style={{ padding: '12px' }}>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: sale.paymentStatus === 'Paid' ? '#d4edda' : '#fff3cd',
                    color: sale.paymentStatus === 'Paid' ? '#155724' : '#856404'
                  }}
                >
                  {sale.paymentStatus}
                </span>
              </td>
              <td style={{ padding: '12px' }}>{new Date(sale.createdAt).toLocaleString()}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}