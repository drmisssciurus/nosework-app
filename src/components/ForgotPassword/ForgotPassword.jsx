import { useState } from 'react';

import styles from './ForgotPassword.module.css';
import arrowBack from '../../assets/icons/icon-arrow-left.svg';
import Button from '../Button/Button';

function ForgotPassword({ closeModal }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword(e) {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/User/ForgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      //delete
      console.log('Ответ сервера:', response);

      if (!response.ok) throw new Error('Error sending email');

      setMessage('Check your email, a password reset link has been sent.');
    } catch (error) {
      console.error('Error in handleForgotPassword:', error);

      setMessage(error.message);
    }
  }

  return (
    <div className={styles.forgotpassword}>
      <div className={styles.titleWrapper}>
        <button className={styles.btnClose} onClick={closeModal}>
          <img src={arrowBack} alt="back" />
        </button>
        <h2 className={styles.title}>שכחת סיסמה?</h2>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      <form className={styles.form} onSubmit={handleForgotPassword}>
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="דואר אלקטרוני"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'שולח...' : 'שלח'}
        </Button>
      </form>
    </div>
  );
}

export default ForgotPassword;
