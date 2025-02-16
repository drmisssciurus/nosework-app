import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';
import Register from '../../components/Register/Register';

import logIn from '../../assets/login.png';
import openEyeIcon from '../../assets/icons/open-eye.svg';
import closedEyeIcon from '../../assets/icons/close-eye.svg';
import styles from './LogIn.module.css';

Modal.setAppElement('#root');

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const navigate = useNavigate();

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(event) {
    console.log('Отправляем email:', email);
    console.log('Отправляем пароль:', password);

    event.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Некорректный email.');
      return;
    }

    try {
      const requestBody = JSON.stringify({ email, password });
      console.log('Отправка запроса:', requestBody);

      const response = await fetch('/api/User/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка входа: ${errorText || 'Проверьте почту и пароль.'}`
        );
      }

      const data = await response.json();
      console.log('Успешный вход:', data);

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      navigate('/mainpage');
    } catch (err) {
      console.error('Ошибка при запросе:', err);
      setError('Ошибка сервера. Попробуйте позже.');
    }
  }

  return (
    <div className="container">
      <div className={styles.login}>
        <img src={logIn} alt="Login" className={styles.loginImg} />

        <p className={styles.title}>NoseWorks</p>
        <p className={styles.description}>התחבר</p>

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
          <div className={styles.item} style={{ position: 'relative' }}>
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              placeholder="סיסמה"
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
                alt="Показать пароль"
              />
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn}>
            המשך
          </button>
        </form>

        <div className={styles.links}>
          <button
            className={styles.text}
            onClick={() => setIsForgotPasswordOpen(true)}
            to="/forgotpassword"
          >
            שכחתי סיסמה
          </button>
          <button
            className={styles.text}
            onClick={() => setIsRegisterOpen(true)}
            to="/register"
          >
            אין לך חשבון? יצר חשבון
          </button>
        </div>

        <Modal
          isOpen={isRegisterOpen}
          onRequestClose={() => setIsRegisterOpen(false)}
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <Register closeModal={() => setIsRegisterOpen(false)} />
        </Modal>

        <Modal
          isOpen={isForgotPasswordOpen}
          onRequestClose={() => setIsForgotPasswordOpen(false)}
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <ForgotPassword closeModal={() => setIsForgotPasswordOpen(false)} />
        </Modal>
      </div>
    </div>
  );
}

export default LogIn;
