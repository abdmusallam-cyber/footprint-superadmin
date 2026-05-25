import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSuperAdmin } from '../../context/SuperAdminContext';

export default function ProtectedRoute() {
  const location = useLocation();
  const { checkAuth } = useSuperAdmin();
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    return <Navigate to="/superadmin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
