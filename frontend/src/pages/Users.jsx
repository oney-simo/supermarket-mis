import React, { useState, useEffect, useContext } from 'react';
import { getUsers, createUser, resetPassword, deleteUser } from '../api/userApi';
import { AuthContext } from '../context/AuthContext';
import UserTable from '../components/users/UserTable';
import UserModal from '../components/users/UserModal';
import ResetPasswordModal from '../components/users/ResetPasswordModal';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);

  const { role } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load system users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    await createUser(userData);
    fetchUsers();
  };

  const handleResetPassword = async (userId, newPassword) => {
    await resetPassword(userId, newPassword);
    alert('Password updated successfully.');
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>User Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Add New User
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <UserTable
          users={users}
          currentRole={role}
          onResetPassword={(u) => setSelectedUserForReset(u)}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* Add User Modal */}
      <UserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleCreateUser}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={!!selectedUserForReset}
        user={selectedUserForReset}
        onClose={() => setSelectedUserForReset(null)}
        onSuccess={handleResetPassword}
      />
    </div>
  );
}