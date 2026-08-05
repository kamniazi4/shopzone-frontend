// Redirects already-authenticated users away from guest-only pages (login/register)
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

function GuestRoute() {
  const { accessToken } = useAppSelector((state) => state.auth);

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;