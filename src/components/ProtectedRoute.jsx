import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const token = localStorage.getItem('token');

  //delete
  console.log(token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
