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
          {/* исправить !!! */}
          <Link to="/mainpage">
            <button className={styles.btn}>המשך</button>
          </Link>
        </form>

        <div className={styles.links}>
          {/* forgot password */}
          <Link className={styles.text} to="/forgotpassword">
            שכחתי סיסמה
          </Link>
          {/* new user register */}
          <Link className={styles.text} to="/register">
            אין לך חשבון? יצר חשבון
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
