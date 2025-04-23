/**
 * Validate an email address against a simple regex pattern.
 * @param {string} email - The email string to validate.
 * @returns {null|string} - Returns null if valid, otherwise an error message.
 */

export function validateEmail(email) {
  // Regex: one or more non-space/@ characters, '@', domain, '.', TLD
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : 'Please enter a valid email';
}

// /**
//  * Validate password strength (currently unused).
//  * @param {string} password - The password to validate.
//  * @returns {null|string} - Null if it meets all criteria, otherwise an error message.
//  */
// export function validatePassword(password) {
//   if (password.length < 8) return 'Password must be at least 8 characters long';
//   if (!/[A-Z]/.test(password))
//     return 'The password must contain at least one capital letter.';
//   if (!/[0-9]/.test(password))
//     return 'The password must contain at least one number.';
//   if (!/[^a-zA-Z0-9]/.test(password))
//     return 'Passwords must have at least one non-alphanumeric character.';
//   return null;
// }

/**
 * Format an ISO date string into a human‑readable format.
 * @param {string} dateString - ISO‑formatted date (e.g. "2025-04-22T...").
 * @returns {string} - Formatted date like "April 22, 2025".
 */
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

/**
 * Calculate age in total months from a birth date until today.
 * @param {string|Date} dateOfBirth - Birth date as ISO string or Date object.
 * @returns {number} - Age expressed in months.
 */
export function calculateAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  // Compute difference in years and months
  const yearsDiff = today.getFullYear() - birthDate.getFullYear();
  const monthsDiff = today.getMonth() - birthDate.getMonth();

  return yearsDiff * 12 + monthsDiff;
}

/**
 * Convert a dog's age in months into a Hebrew string with years and months.
 * @param {number} ageInMonths - Dog's age measured in months.
 * @returns {string} - Hebrew‑formatted age, e.g. "גיל: 2 שנים ו-3 חודשים".
 */
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
