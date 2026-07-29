import React from 'react';

export default function LogDetailModal({ log, isOpen, onClose }) {
  if (!isOpen || !log) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          width: '550px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Activity Details</h3>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <p><strong>Description:</strong> {log.description}</p>
          <p><strong>User:</strong> {log.user?.fullName || log.user?.username || 'System'}</p>
          <p><strong>Module:</strong> {log.module}</p>
          <p><strong>Action:</strong> {log.action}</p>
          <p><strong>IP Address:</strong> {log.ipAddress || 'N/A'}</p>
          <p><strong>Reference Model:</strong> {log.referenceModel || 'N/A'}</p>
          <p><strong>Reference ID:</strong> {log.referenceId || 'N/A'}</p>
          <p><strong>Timestamp:</strong> {new Date(log.createdAt).toLocaleString()}</p>

          <div style={{ marginTop: '16px' }}>
            <strong>Metadata / Payload:</strong>
            <pre
              style={{
                backgroundColor: '#f8f9fa',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                fontSize: '12px',
                overflowX: 'auto'
              }}
            >
              {JSON.stringify(log.metadata || {}, null, 2)}
            </pre>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}