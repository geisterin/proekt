import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { CircularProgress, Box } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
  role?: 'client' | 'klient' | 'manager' | 'tootaja';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user, token, isLoading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.userType !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 