import styles from './ForgotPassword.module.css';
import arrowBack from '../../assets/icons/icon-arrow-left.svg';
import { useState } from 'react';
import Button from '../Button/Button';

function ForgotPassword({ closeModal }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  //Sending email for password reset
  async function handleForgotPassword(e) {
    e.preventDefault();

    //delete
    console.log('Отправка запроса на восстановление пароля...');
    //delete
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
      console.error('Error in handleForgotPassword:', error);

      setMessage(error.message);
    }
  }

  //Sending new password and token
  async function handleResetPassword(e) {
    e.preventDefault();

    //delete
    console.log('Отправка нового пароля...');
    //delete
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
          `Error resetting password: ${response.status} - ${errorText}`
        );
      }

      setMessage('Password successfully changed!');
      setStep(1);
    } catch (error) {
      console.error('Error in handleResetPassword:', error);
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
            name="email"
            placeholder="דואר אלקטרוני"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">שלח</Button>
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
          <Button type="submit">אפס סיסמה</Button>
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
