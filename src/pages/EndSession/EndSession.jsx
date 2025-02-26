import Footer from '../../components/Footer/Footer';

import styles from './EndSession.module.css';

import logoDog from '../../assets/success-dog.png';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

function EndSession() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>האימון הסתיים</h1>
      </header>
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>
            האימון הסתיים <br />
            בהצלחה
          </h2>
          <div className={styles.image}>
            <img src={logoDog} alt="Logo dog" />
          </div>
        </div>
        <div className={styles.btnWrapper}>
          <Button className={styles.btn} onClick={() => navigate('/mainpage')}>
            חזרה למסך הבית
          </Button>
          <Button className={styles.btn}>הצגת האימון</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EndSession;
