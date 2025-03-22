import { Link } from 'react-router-dom';
import styles from './Welcome.module.css';
import logo from '../../assets/logo.png';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.jpeg';
import Button from '../../components/Button/Button';

function Welcome() {
  return (
    <div className="container">
      <div className={styles.welcome}>
        <div>
          <div className={styles.logosWrapper}>
            <img className={styles.imgLogo} src={logo1} />
            <img className={styles.imgLogo} src={logo2} />
          </div>
          <p className={styles.title}>NoseWorks</p>
          <p className={styles.about}>
            Analyze your dog&apos;s training sessions efficiently and track
            improvement.
          </p>
          <img className={styles.img} src={logo} />
        </div>
        <Link to="/login" className={styles.btn}>
          <Button>התחל</Button>
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
