import React from 'react';

export default function DailySalesChart({ data }) {
  if (!data || data.length === 0) return <p>No chart data available.</p>;

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 10);

  return (
    <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)', padding: '24px', borderRadius: '16px', boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)', border: '1px solid #e5e7eb', minHeight: '360px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#0f172a' }}>7-Day Revenue Trend</h3>
          <p style={{ marginTop: '4px', color: '#64748b', fontSize: '13px' }}>Daily sales performance</p>
        </div>
        <span style={{ padding: '6px 10px', background: '#eff6ff', color: '#2563eb', borderRadius: '999px', fontSize: '12px', fontWeight: '700' }}>TZS</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '240px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        {data.map((item, index) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;
          return (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#0f766e', marginBottom: '6px' }}>
                TZS {item.revenue.toFixed(0)}
              </span>
              <div
                title={`${item.date}: TZS ${item.revenue.toFixed(2)} (${item.transactions} sales)`}
                style={{
                  width: '78%',
                  height: `${Math.max(heightPercent, 6)}%`,
                  background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '8px 8px 2px 2px',
                  transition: 'height 0.3s ease, transform 0.2s ease',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)'
                }}
              />
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', transform: 'rotate(-20deg)', whiteSpace: 'nowrap' }}>
                {item.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}