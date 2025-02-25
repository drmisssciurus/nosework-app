import styles from './Welcome.module.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';

function Welcome() {
  return (
    <div className="container">
      <div className={styles.welcome}>
        <div>
          <p className={styles.title}>NoseWorks</p>
          <p className={styles.about}>
            Analyze your dog&apos;s training sessions efficiently and track
            improvement.
          </p>
          <img className={styles.img} src={logo} />
        </div>
        <Link to="/login">
          <Button>התחל</Button>
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
