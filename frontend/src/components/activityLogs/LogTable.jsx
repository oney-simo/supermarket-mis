import React from 'react';

export default function LogTable({ logs, onViewDetails }) {
  const getActionBadgeStyle = (action) => {
    switch (action?.toLowerCase()) {
      case 'create':
        return { backgroundColor: '#28a745', color: '#fff' };
      case 'delete':
        return { backgroundColor: '#dc3545', color: '#fff' };
      case 'reset_password':
      case 'update':
        return { backgroundColor: '#ffc107', color: '#212529' };
      default:
        return { backgroundColor: '#17a2b8', color: '#fff' };
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div style={{ backgroundColor: '#fff', padding: '30px', textAlign: 'center', borderRadius: '8px', color: '#6c757d' }}>
        No activity logs found matching the selected criteria.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px 8px 0 0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <th style={{ padding: '12px' }}>Timestamp</th>
            <th style={{ padding: '12px' }}>User</th>
            <th style={{ padding: '12px' }}>Module</th>
            <th style={{ padding: '12px' }}>Action</th>
            <th style={{ padding: '12px' }}>Description</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '12px', whiteSpace: 'nowrap', color: '#495057' }}>
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>
                {log.user?.fullName || log.user?.username || 'System'}
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{ fontWeight: '600', color: '#495057' }}>{log.module}</span>
              </td>
              <td style={{ padding: '12px' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    ...getActionBadgeStyle(log.action)
                  }}
                >
                  {log.action}
                </span>
              </td>
              <td style={{ padding: '12px', color: '#212529' }}>{log.description}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>
                <button
                  onClick={() => onViewDetails(log)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Inspect
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}