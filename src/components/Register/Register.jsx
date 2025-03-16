import { useState } from 'react';
import { validateEmail } from '../../utils/utils';

import styles from './Register.module.css';
import arrowBack from '../../assets/icons/icon-arrow-left.svg';
import openEyeIcon from '../../assets/icons/open-eye.svg';
import closedEyeIcon from '../../assets/icons/close-eye.svg';
import Button from '../Button/Button';

function Register({ closeModal }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {
      email: validateEmail(formData.email),
      name: formData.name.trim() ? '' : 'Name is required',
      confirmPassword:
        formData.password !== formData.confirmPassword
          ? 'Passwords do not match'
          : '',
    };

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch('/api/User/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(Object.values(data)?.[0]?.[0] || 'Registration error');
      }

      setMessage(
        'Registration successful! Please check your email to confirm your account.'
      );
      console.log(formData);
      setFormData({ email: '', name: '', password: '', confirmPassword: '' });
      setShowPassword(false);
      setShowSecondPassword(false);
      setErrors({});
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className={styles.register}>
      <div className={styles.titleWrapper}>
        <button className={styles.btnClose} onClick={closeModal}>
          <img src={arrowBack} alt="Back" />
        </button>
        <h2 className={styles.title}>הירשמו עכשיו</h2>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.item}>
          <input
            className={`${styles.input} ${
              errors.email ? styles.errorBorder : ''
            }`}
            type="email"
            name="email"
            placeholder="דואר אלקטרוני"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>
        <div className={styles.item}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="שם"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
        </div>
        <div className={styles.item} style={{ position: 'relative' }}>
          <input
            className={`${styles.input} ${
              errors.password ? styles.errorBorder : ''
            }`}
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="סיסמה"
            value={formData.password}
            onChange={handleChange}
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
        <div className={styles.item} style={{ position: 'relative' }}>
          <input
            className={`${styles.input} ${
              errors.confirmPassword ? styles.errorBorder : ''
            }`}
            type={showSecondPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="אמת סיסמה"
            value={formData.confirmPassword}
            onChange={handleChange}
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

        {errors.confirmPassword && (
          <p className={styles.errorText}>{errors.confirmPassword}</p>
        )}
        {message && <p className={styles.errorText}>{message}</p>}
        <Button type="submit">הירשמו</Button>
      </form>
    </div>
  );
}

export default Register;
