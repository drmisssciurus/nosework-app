import styles from './ForgotPassword.module.css';
import arrowBack from '../../assets/icons/icon-arrow-left.svg';
import { useState } from 'react';

function ForgotPassword({ closeModal }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  //Sending email for password reset
  async function handleForgotPassword(e) {
    e.preventDefault();

    console.log('Отправка запроса на восстановление пароля...');
    console.log('Отправляем email:', email);

    try {
      const response = await fetch('/api/User/ForgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      console.log('Ответ сервера:', response);

      if (!response.ok) throw new Error('Error sending email');

      setMessage('Check your email, a password reset link has been sent.');
      setStep(2);
    } catch (error) {
      console.error('Ошибка в handleForgotPassword:', error);

      setMessage(error.message);
    }
  }

  //Sending new password and token
  async function handleResetPassword(e) {
    e.preventDefault();

    console.log('Отправка нового пароля...');
    console.log('Email:', email, 'Token:', token, 'Password:', password);

    try {
      const response = await fetch('/api/User/ResetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      });

      console.log('Ответ сервера:', response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка при сбросе пароля: ${response.status} - ${errorText}`
        );
      }

      setMessage('Password successfully changed!');
      setStep(1);
    } catch (error) {
      console.error('Ошибка в handleResetPassword:', error);
      setMessage(error.message);
    }
  }

  return (
    <div className={styles.forgotpassword}>
      <div className={styles.titleWrapper}>
        <button className={styles.btnClose} onClick={closeModal}>
          <img src={arrowBack} alt="back" />
        </button>
        <h2 className={styles.title}>
          {step === 1 ? 'איפוס סיסמה' : 'הזן את הקוד והסיסמה החדשה'}
        </h2>
      </div>
      {message && <p className={styles.message}>{message}</p>}

      {step === 1 ? (
        <form className={styles.form} onSubmit={handleForgotPassword}>
          <input
            className={styles.input}
            type="email"
            placeholder="דואר אלקטרוני"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className={styles.btn} type="submit">
            שלח
          </button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={handleResetPassword}>
          <input
            className={styles.input}
            type="text"
            placeholder="הזן את הקוד מהאימייל"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="סיסמה חדשה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className={styles.btn} type="submit">
            אפס סיסמה
          </button>
        </form>
      )}

      {/* <form className={styles.form} action="">
        <input
          className={styles.input}
          type="mail"
          placeholder="דואר אלקטרוני"
        />
        <button className={styles.btn}>שלח</button>
      </form> */}
    </div>
  );
}

export default ForgotPassword;
