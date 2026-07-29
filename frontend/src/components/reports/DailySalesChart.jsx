import React from 'react';

export default function DailySalesChart({ data }) {
  if (!data || data.length === 0) return <p>No chart data available.</p>;

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 10); // Prevents division by zero

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>7-Day Revenue Trend</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '200px', borderBottom: '2px solid #dee2e6', paddingBottom: '10px' }}>
        {data.map((item, index) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;
          return (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#28a745', marginBottom: '4px' }}>
                ${item.revenue.toFixed(0)}
              </span>
              <div
                title={`${item.date}: $${item.revenue.toFixed(2)} (${item.transactions} sales)`}
                style={{
                  width: '70%',
                  height: `${Math.max(heightPercent, 4)}%`,
                  backgroundColor: '#007bff',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }}
              />
              <span style={{ fontSize: '11px', color: '#6c757d', marginTop: '8px', transform: 'rotate(-25deg)', whiteSpace: 'nowrap' }}>
                {item.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}