import React from 'react';

export default function SummaryCards({ summary, valuation }) {
  const potentialProfit = (valuation?.totalRetailValue || 0) - (valuation?.totalAssetCost || 0);

  const cardStyle = {
    flex: 1,
    minWidth: '220px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
    borderLeft: '4px solid #007bff',
    transition: 'transform 220ms ease, box-shadow 220ms ease'
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '25px' }}>
      <div style={{ ...cardStyle, borderLeftColor: '#28a745' }}>
        <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 'bold' }}>TOTAL REVENUE</span>
        <h2 style={{ margin: '8px 0 0', color: '#28a745' }}>TZS {summary?.totalRevenue?.toFixed(2) || '0.00'}</h2>
        <span style={{ fontSize: '12px', color: '#6c757d' }}>{summary?.totalSales || 0} Transactions</span>
      </div>

      <div style={{ ...cardStyle, borderLeftColor: '#17a2b8' }}>
        <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 'bold' }}>INVENTORY VALUATION</span>
        <h2 style={{ margin: '8px 0 0', color: '#17a2b8' }}>TZS {valuation?.totalAssetCost?.toFixed(2) || '0.00'}</h2>
        <span style={{ fontSize: '12px', color: '#6c757d' }}>{valuation?.totalUnits || 0} Total Units in Stock</span>
      </div>

      <div style={{ ...cardStyle, borderLeftColor: '#ffc107' }}>
        <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 'bold' }}>RETAIL STOCK VALUE</span>
        <h2 style={{ margin: '8px 0 0', color: '#d39e00' }}>TZS {valuation?.totalRetailValue?.toFixed(2) || '0.00'}</h2>
        <span style={{ fontSize: '12px', color: '#6c757d' }}>Expected Sale Value</span>
      </div>

      <div style={{ ...cardStyle, borderLeftColor: '#6f42c1' }}>
        <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 'bold' }}>POTENTIAL MARGIN</span>
        <h2 style={{ margin: '8px 0 0', color: '#6f42c1' }}>TZS {potentialProfit.toFixed(2)}</h2>
        <span style={{ fontSize: '12px', color: '#6c757d' }}>Projected Stock Profit</span>
      </div>
    </div>
  );
}