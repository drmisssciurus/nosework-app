import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ProtectedRoute() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  //delete
  console.log('Checking token in ProtectedRoute:', token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
