import { useState } from 'react';
import styles from './Register.module.css';
import arrowBack from '../../assets/icons/icon-arrow-left.svg';

function Register({ closeModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Email:', email, 'Password:', password);
  }
  return (
    <div className={styles.register}>
      <div className={styles.titleWrapper}>
        <button className={styles.btnClose} onClick={closeModal}>
          <img src={arrowBack} alt="" />
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className={styles.btn}>הירשמו</button>
      </form>
    </div>
  );
}

export default Register;
