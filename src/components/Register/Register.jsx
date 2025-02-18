import { useState } from 'react';
import styles from './Register.module.css';
import arrowBack from '../../assets/icons/icon-arrow-left.svg';
import { validateEmail, validatePassword } from '../../utils/utils';

function Register({ closeModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage('The passwords do not match');
      return;
    }

    // Validate password before sending
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) {
      setMessage(emailError);
      return;
    }

    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    const userData = { email, password };

    //delete
    console.log('Отправляем на сервер:', userData);

    try {
      const response = await fetch('/api/User/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(userData),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Ошибка парсинга JSON:', jsonError);
        throw new Error('Некорректный ответ сервера');
      }

      //delete
      console.log('Ответ от сервера:', data);

      if (!response.ok) {
        throw new Error(data?.message || 'Ошибка регистрации');
      }

      setMessage('Регистрация успешна!');
      closeModal();
    } catch (error) {
      console.error('Ошибка регистрации:', error);
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
            className={styles.input}
            type="email"
            placeholder="דואר אלקטרוני"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.item}>
          <input
            className={styles.input}
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.item}>
          <input
            className={styles.input}
            type="password"
            placeholder="אמת סיסמה"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {message && <p className={styles.message}>{message}</p>}
        <button className={styles.btn} type="submit">
          הירשמו
        </button>
      </form>
    </div>
  );
}

export default Register;
