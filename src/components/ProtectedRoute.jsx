import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProtectedRoute() {
  const [tokenExists, setTokenExists] = useState(
    !!localStorage.getItem('token')
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setTokenExists(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return tokenExists ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
