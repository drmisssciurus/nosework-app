import styles from './Welcome.module.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <>
      <div>
        <p className={styles.title}>NoseWorks</p>
        <p className={styles.about}>
          Analyze your dog&apos;s training sessions efficiently and track
          improvement.
        </p>
        <img className={styles.img} src={logo} />
      </div>
      <Link to="/login">
        <button className={styles.btn}>התחל</button>
      </Link>
      <p className={styles.text}>להתחבר</p>
    </>
  );
}

export default Welcome;
