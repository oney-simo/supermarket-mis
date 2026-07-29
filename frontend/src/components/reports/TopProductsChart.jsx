import React from 'react';

export default function TopProductsChart({ products }) {
  if (!products || products.length === 0) return <p>No product sales recorded yet.</p>;

  const topItems = products.slice(0, 5); // Top 5
  const maxQty = Math.max(...topItems.map((p) => p.quantity), 1);

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Top Selling Products</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {topItems.map((prod, index) => {
          const barWidthPercent = (prod.quantity / maxQty) * 100;

          return (
            <div key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <strong>{prod.name} <span style={{ color: '#6c757d', fontWeight: 'normal' }}>({prod.sku})</span></strong>
                <span>{prod.quantity} {prod.unit || 'units'} (${prod.revenue.toFixed(2)})</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e9ecef', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.max(barWidthPercent, 2)}%`,
                    backgroundColor: '#28a745',
                    height: '100%',
                    borderRadius: '6px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}