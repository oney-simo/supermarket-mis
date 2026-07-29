import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Modal from './common/Modal';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      setNotice({
        title: 'Sign in required',
        message: 'Please sign in to continue using the dashboard.',
        actionLabel: 'Go to login',
        action: () => navigate('/login', { replace: true })
      });
      return;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      setNotice({
        title: 'Access restricted',
        message: 'You do not have permission to access this module.',
        actionLabel: 'Back to sales',
        action: () => navigate('/sales', { replace: true })
      });
    }
  }, [allowedRoles, isAuthenticated, loading, navigate, role]);

  if (loading) return <div className="content">Checking authorization...</div>;

  if (notice) {
    return (
      <Modal
        isOpen={Boolean(notice)}
        title={notice.title}
        subtitle={notice.message}
        onClose={() => {
          notice.action();
          setNotice(null);
        }}
        footer={
          <button
            className="btn btn--blue"
            type="button"
            onClick={() => {
              notice.action();
              setNotice(null);
            }}
          >
            {notice.actionLabel}
          </button>
        }
      />
    );
  }

  return <Outlet />;
}