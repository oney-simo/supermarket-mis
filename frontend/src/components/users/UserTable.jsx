import React from 'react';

export default function UserTable({ users, currentRole, onResetPassword, onDeleteUser }) {
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return { backgroundColor: '#dc3545', color: '#fff' };
      case 'manager':
        return { backgroundColor: '#007bff', color: '#fff' };
      default:
        return { backgroundColor: '#6c757d', color: '#fff' };
    }
  };

  if (!users || users.length === 0) {
    return <p style={{ textAlign: 'center', color: '#6c757d' }}>No users found.</p>;
  }

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <th style={{ padding: '12px' }}>Full Name</th>
            <th style={{ padding: '12px' }}>Username</th>
            <th style={{ padding: '12px' }}>Role</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.fullName || 'N/A'}</td>
              <td style={{ padding: '12px' }}>{u.username}</td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  ...getRoleBadgeStyle(u.role)
                }}>
                  {u.role}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{ color: u.isActive !== false ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                  {u.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'right' }}>
                <button
                  onClick={() => onResetPassword(u)}
                  style={{
                    padding: '6px 10px',
                    marginRight: '8px',
                    backgroundColor: '#17a2b8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Reset Password
                </button>

                {/* Delete button only permitted for Admin role */}
                {currentRole === 'admin' && (
                  <button
                    onClick={() => onDeleteUser(u._id, u.username)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}