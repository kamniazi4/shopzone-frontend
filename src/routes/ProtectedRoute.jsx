// Restricts access to routes based on authenticated user's roles
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

function ProtectedRoute({ allowedRoles }) {
  const { user, roles, accessToken } = useAppSelector((state) => state.auth);

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = roles.some((role) => allowedRoles.includes(role));
    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;