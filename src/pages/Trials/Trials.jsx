import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import styles from './Trials.module.css';

function Trials() {
  return (
    <div className="container">
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <h1 className={styles.trialNumber}>שליחה #1</h1>
        </header>
        <div className={styles.containers}>
          <div className={styles.container}>
            <p className={styles.boxName}>סניפר 1</p>
            <p>חיובי</p>
          </div>
          <div className={styles.container}>
            <p className={styles.boxName}>סניפר 2</p>
            <p>ביקורת</p>
          </div>
          <div className={styles.container}>
            <p className={styles.boxName}>סניפר 3</p>
            <p>שלילי</p>
          </div>
        </div>
        <div className={styles.videoContainer}>
          <h2 className={styles.videoTitle}>העלאה או הקלטה של סרטון</h2>
          <div className={styles.btnContainer}>
            <button className={styles.btnVideo}>העלאה</button>
            <Link to="/video_recording" className={styles.btnVideo}>
              הקלטה
            </Link>
          </div>
        </div>
        <div className={styles.wrapper}>
          <label className={styles.inputLabel} htmlFor="">
            סוג ריח מטרה
          </label>
          <input
            className={styles.input}
            type="text"
            placeholder="שם הריח פה"
          />
        </div>
        <div className={styles.checkboxes}>
          <p className={styles.checkbLabel}>הסימון הסופי</p>
          <div className={styles.checkbWrapper}>
            <div className={styles.item}>
              <p className={styles.itemName}>סניפר 1</p>
              <input type="radio" name="finalChoise" />
            </div>
            <div className={styles.item}>
              <p className={styles.itemName}>סניפר 2</p>
              <input type="radio" name="finalChoise" />
            </div>
            <div className={styles.item}>
              <p className={styles.itemName}>סניפר 3</p>
              <input type="radio" name="finalChoise" />
            </div>
            <div className={styles.item}>
              <p className={styles.itemName}>אין בחירה</p>
              <input type="radio" name="finalChoise" />
            </div>
          </div>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btn}>שליחה הבאה</button>
          <button className={styles.btn}>חזרה למסך הבית</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Trials;
