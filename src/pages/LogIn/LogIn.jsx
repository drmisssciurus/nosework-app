import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import { validateEmail } from '../../utils/utils';

import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';
import Register from '../../components/Register/Register';
import Button from '../../components/Button/Button';

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

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      const requestBody = JSON.stringify({ email, password });

      const response = await fetch('/api/User/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      let errorMessage = 'An error occurred, please try again.';
      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = await response.text();
          }
        } else {
          errorMessage = await response.text();
        }
        setError(errorMessage);
        return;
      }

      let data = {};

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data.message = await response.text();
      }

      if (!data.token) {
        console.error(
          'Authentication error. The server did not return a token.'
        );
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
      console.log('Token:', data.token);

      try {
        const userResponse = await fetch('/api/User', {
          method: 'GET',
          headers: { Authorization: `Bearer ${data.token}` },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to retrieve user data.');
        }

        const users = await userResponse.json();
        const storedEmail = localStorage.getItem('userEmail');
        const currentUser = users.find((user) => user.email === storedEmail);

        if (currentUser) {
          localStorage.setItem('userId', currentUser.id);
          localStorage.setItem('userName', currentUser.userName);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }

      navigate('/mainpage');
    } catch (err) {
      console.error('Error sending request:', err);
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
          <div className={styles.inputsContainer}>
            <div className={styles.item}>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="דואר אלקטרוני"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.item} style={{ position: 'relative' }}>
              <input
                className={`${styles.input} ${password ? styles.invalid : ''}`}
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
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit">המשך</Button>
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
