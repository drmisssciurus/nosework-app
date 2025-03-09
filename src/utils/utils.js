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
  if (!/[^a-zA-Z0-9]/.test(password))
    return 'Passwords must have at least one non-alphanumeric character.';
  return null;
}

export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-EN', options);
}

// export function calculateAge(dateOfBirth) {
//   const birthDate = new Date(dateOfBirth);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (
//     monthDiff < 0 ||
//     (monthDiff === 0 && today.getDate() < birthDate.getDate())
//   ) {
//     age--;
//   }
//   return age;
// }

export function calculateAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  const yearsDiff = today.getFullYear() - birthDate.getFullYear();
  const monthsDiff = today.getMonth() - birthDate.getMonth();

  return yearsDiff * 12 + monthsDiff;
}

export function formatDogAge(ageInMonths) {
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;

  if (years > 0 && months > 0) {
    return `גיל: ${years} שנים ו-${months} חודשים`;
  } else if (years > 0) {
    return `גיל: ${years} שנים`;
  } else {
    return `גיל: ${months} חודשים`;
  }
}
