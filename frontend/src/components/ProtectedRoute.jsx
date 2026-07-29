import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, loading } = useContext(AuthContext);

  if (loading) return <div>Checking authorization...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    alert('Access Denied: You do not have permission to access this module.');
    return <Navigate to="/sales" replace />;
  }

  return <Outlet />;
}