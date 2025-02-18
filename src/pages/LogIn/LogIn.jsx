import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';
import Register from '../../components/Register/Register';

import logIn from '../../assets/login.png';
import openEyeIcon from '../../assets/icons/open-eye.svg';
import closedEyeIcon from '../../assets/icons/close-eye.svg';
import styles from './LogIn.module.css';
import { validateEmail } from '../../utils/utils';

Modal.setAppElement('#root');

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    //delete
    console.log('Отправляем email:', email);
    //delete
    console.log('Отправляем пароль:', password);

    try {
      const requestBody = JSON.stringify({ email, password });
      //delete
      console.log('Отправка запроса:', requestBody);

      const response = await fetch('/api/User/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка входа: ${errorText || 'Проверьте почту и пароль.'}`
        );
      }

      //Check if there is a string in responce
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      //delete
      console.log('Успешный вход:', data);

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      navigate('/mainpage');
    } catch (err) {
      console.error('Error while requesting:', err);
      setError('Server error. Try again later.');
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
                alt="Show password"
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
