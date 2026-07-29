import React from 'react';

export default function LogFilterBar({ filters, setFilters, onApplyFilters, onResetFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 })); // Reset to page 1 on filter edit
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'flex-end'
      }}
    >
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Module</label>
        <select
          name="module"
          value={filters.module || ''}
          onChange={handleChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '130px' }}
        >
          <option value="">All Modules</option>
          <option value="Users">Users</option>
          <option value="Sales">Sales</option>
          <option value="Products">Products</option>
          <option value="Inventory">Inventory</option>
          <option value="Purchases">Purchases</option>
          <option value="StockReceiving">Stock Receiving</option>
          <option value="Settings">Settings</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Action</label>
        <input
          type="text"
          name="action"
          value={filters.action || ''}
          onChange={handleChange}
          placeholder="e.g. create, delete"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '130px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>From Date</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate || ''}
          onChange={handleChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>To Date</label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate || ''}
          onChange={handleChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Filter
        </button>

        <button
          type="button"
          onClick={onResetFilters}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}