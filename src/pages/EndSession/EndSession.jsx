import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

import styles from './EndSession.module.css';

import logoDog from '../../assets/success-dog.png';

function EndSession() {
  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>האימון הסתיים</h1>
      </header>
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
        <button className={styles.btn}>חזרה למסך הבית</button>
        <button className={styles.btn}>הצגת האימון</button>
      </div>
      <Footer />
    </div>
  );
}

export default EndSession;
