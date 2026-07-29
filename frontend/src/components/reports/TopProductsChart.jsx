import React from 'react';

export default function TopProductsChart({ products }) {
  if (!products || products.length === 0) return <p>No product sales recorded yet.</p>;

  const topItems = products.slice(0, 5);
  const maxQty = Math.max(...topItems.map((p) => p.quantity), 1);

  return (
    <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fffb 100%)', padding: '24px', borderRadius: '16px', boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)', border: '1px solid #e5e7eb', minHeight: '360px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#0f172a' }}>Top Selling Products</h3>
          <p style={{ marginTop: '4px', color: '#64748b', fontSize: '13px' }}>Highest volume items</p>
        </div>
        <span style={{ padding: '6px 10px', background: '#ecfdf5', color: '#15803d', borderRadius: '999px', fontSize: '12px', fontWeight: '700' }}>TZS</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topItems.map((prod, index) => {
          const barWidthPercent = (prod.quantity / maxQty) * 100;

          return (
            <div key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', gap: '10px' }}>
                <strong style={{ color: '#0f172a' }}>{prod.name} <span style={{ color: '#64748b', fontWeight: 'normal' }}>({prod.sku})</span></strong>
                <span style={{ color: '#0f766e', fontWeight: '700' }}>{prod.quantity} {prod.unit || 'units'} · TZS {prod.revenue.toFixed(2)}</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '12px', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.max(barWidthPercent, 2)}%`,
                    background: 'linear-gradient(90deg, #16a34a 0%, #4ade80 100%)',
                    height: '100%',
                    borderRadius: '999px',
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