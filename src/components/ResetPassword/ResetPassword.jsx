import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './ResetPassword.module.css';
// import { validatePassword } from '../../utils/utils';
import Button from '../Button/Button';
import openEyeIcon from '../../assets/icons/open-eye.svg';
import closedEyeIcon from '../../assets/icons/close-eye.svg';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);

  async function handleResetPassword(e) {
    e.preventDefault();

    const newErrors = {
      password: password,
      confirmPassword:
        password !== confirmPassword ? 'Passwords do not match' : '',
    };

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);

    try {
      const response = await fetch('/api/User/ResetPassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          newPassword: password,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Password reset error');
      }

      setMessage('הסיסמה אופסה בהצלחה! כעת תועבר/י לדף ההתחברות.');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowSecondPassword(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="container">
      <div className={styles.content}>
        <h2 className={styles.title}>הגדרת סיסמה חדשה</h2>
        <form className={styles.form} onSubmit={handleResetPassword}>
          <div className={styles.item}>
            <input
              className={`${styles.input} ${
                errors.password ? styles.errorBorder : ''
              }`}
              type={showPassword ? 'text' : 'password'}
              placeholder="סיסמה חדשה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.watchPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? openEyeIcon : closedEyeIcon}
                alt="Show password"
              />
            </button>
          </div>
          <div className={styles.item}>
            <input
              className={`${styles.input} ${
                errors.confirmPassword ? styles.errorBorder : ''
              }`}
              type={showSecondPassword ? 'text' : 'password'}
              placeholder="אמת סיסמה חדשה"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.watchPassword}
              onClick={() => setShowSecondPassword(!showSecondPassword)}
            >
              <img
                src={showSecondPassword ? openEyeIcon : closedEyeIcon}
                alt="Show password"
              />
            </button>
          </div>
          {message && <p className={styles.message}>{message}</p>}
          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}
          {errors.confirmPassword && (
            <p className={styles.errorText}>{errors.confirmPassword}</p>
          )}
          <Button type="submit">עדכון סיסמה</Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
