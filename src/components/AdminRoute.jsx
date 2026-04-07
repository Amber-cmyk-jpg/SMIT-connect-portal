// src/components/AdminRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { user, role } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/admin/login" replace />;
  if (role !== 'admin') return <Navigate to="/" replace />;

  return children;
}