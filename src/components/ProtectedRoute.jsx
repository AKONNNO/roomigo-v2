// ProtectedRoute component — coded by Prince Korankye Akonno
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Protected route wrapper enforcing role-based access control.
// - requiresAuth: any logged-in user
// - roles: array of allowed roles (e.g. ['admin'], ['manager'], ['student'])
const ProtectedRoute = ({ children, roles = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
