import { useState } from 'react';
import { Link } from 'react-router-dom';

import logIn from '../../assets/login.png';
import styles from './LogIn.module.css';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Email:', email, 'Password:', password);
  }

  return (
    <div className="login-container">
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
        <button className={styles.btn}>המשך</button>
      </form>

      <div className={styles.links}>
        <Link className={styles.text} to="/">
          שכחתי סיסמה
        </Link>
        <Link className={styles.text} to="/">
          אין לך חשבון? יצר חשבון
        </Link>
      </div>
    </div>
  );
}

export default LogIn;
