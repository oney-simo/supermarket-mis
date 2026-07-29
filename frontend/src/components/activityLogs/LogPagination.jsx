import React from 'react';

export default function LogPagination({ pagination, onPageChange }) {
  if (!pagination || pagination.total === 0) return null;

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div
      style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#fff',
        borderRadius: '0 0 8px 8px',
        borderTop: '1px solid #dee2e6',
        fontSize: '14px'
      }}
    >
      <span>
        Showing Page <strong>{pagination.page}</strong> of <strong>{totalPages}</strong> ({pagination.total} Total Entries)
      </span>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
          style={{
            padding: '6px 12px',
            backgroundColor: pagination.page <= 1 ? '#e9ecef' : '#007bff',
            color: pagination.page <= 1 ? '#6c757d' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>

        <button
          disabled={pagination.page >= totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
          style={{
            padding: '6px 12px',
            backgroundColor: pagination.page >= totalPages ? '#e9ecef' : '#007bff',
            color: pagination.page >= totalPages ? '#6c757d' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: pagination.page >= totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}