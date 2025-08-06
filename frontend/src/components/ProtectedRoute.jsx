import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  if (location.pathname === '/') {
    if (user.role === 'user') return <Navigate to="/user" replace />;
    if (user.role === 'company') return <Navigate to="/company" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
