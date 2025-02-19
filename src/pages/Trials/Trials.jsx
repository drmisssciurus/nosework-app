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
            <button className={styles.btnVideo}>הקלטה</button>
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
          <p>checkboxes</p>
          <div className={styles.checkbWrapper}>
            <div className={styles.item}>
              <p>item</p>
              <input type="checkbox" />
            </div>
            <div className={styles.item}>
              <p>item</p>
              <input type="checkbox" />
            </div>
            <div className={styles.item}>
              <p>item</p>
              <input type="checkbox" />
            </div>
            <div className={styles.item}>
              <p>item</p>
              <input type="checkbox" />
            </div>
          </div>
        </div>
        <button className={styles.btn}>next session</button>
        <button className={styles.btn}>return to main page</button>
      </div>
      <Footer />
    </div>
  );
}

export default Trials;
