import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({
  children
}: any) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
