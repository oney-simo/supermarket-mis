import React from 'react';

export default function CustomerTable({ customers, loading, onEdit, onDelete, onViewHistory }) {
  if (loading) return <p>Loading customers...</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
      <thead>
        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
          <th style={{ padding: '12px' }}>Name</th>
          <th style={{ padding: '12px' }}>Phone</th>
          <th style={{ padding: '12px' }}>Email</th>
          <th style={{ padding: '12px' }}>Type</th>
          <th style={{ padding: '12px' }}>Status</th>
          <th style={{ padding: '12px' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
              No customers found.
            </td>
          </tr>
        ) : (
          customers.map((cust) => (
            <tr key={cust._id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{cust.name}</td>
              <td style={{ padding: '12px' }}>{cust.phone || '—'}</td>
              <td style={{ padding: '12px' }}>{cust.email || '—'}</td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: cust.customerType === 'Wholesale' ? '#cce5ff' : '#e2e3e5',
                  color: cust.customerType === 'Wholesale' ? '#004085' : '#383d41'
                }}>
                  {cust.customerType}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: cust.status === 'Active' ? '#d4edda' : '#f8d7da',
                  color: cust.status === 'Active' ? '#155724' : '#721c24'
                }}>
                  {cust.status}
                </span>
              </td>
              <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onViewHistory(cust)}
                  style={{ padding: '6px 10px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  History
                </button>
                <button
                  onClick={() => onEdit(cust)}
                  style={{ padding: '6px 10px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(cust._id)}
                  style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}