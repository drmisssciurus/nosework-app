import styles from './Trials.module.css';

function Trials() {
  return (
    <div className="container">
      <div>
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
        <div>video container</div>
        <div className={styles.wrapper}>
          <label htmlFor="">label for input</label>
          <input className={styles.input} type="text" placeholder="text" />
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
        <footer>NoseWorks - שפרו את האימונים שלכם</footer>
      </div>
    </div>
  );
}

export default Trials;
