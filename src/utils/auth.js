// utils/auth.js

export function handleUnauthorized(navigate) {
  localStorage.removeItem('token');
  navigate('/login');
}
