import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;

  // Role validation
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'doctor' ? "/doctor-dashboard" : "/"} />;
  }

  return children;
};

export default ProtectedRoute;  