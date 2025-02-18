export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : 'Please enter a valid email';
}

export function validatePassword(password) {
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/[A-Z]/.test(password))
    return 'The password must contain at least one capital letter.';
  if (!/[0-9]/.test(password))
    return 'The password must contain at least one number.';
  return null;
}
