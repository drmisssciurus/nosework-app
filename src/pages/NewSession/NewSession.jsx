import styles from './NewSession.module.css';
import NavBar from '../../components/NavBar/NavBar';
import Header from '../../components/Header/Header';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function NewSession({ setTrials }) {
  return (
    <div className="container">
      <div>
        <Header>הוספת אימון חדש</Header>
        <p className={styles.sessionname}>אימון מספר 19</p>
        <p className={styles.sessionsubtitle}>
          מספר מעודכן אוטומטית לפי הכלב המתאמן
        </p>

        <form action="" className={styles.form}>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="">
              תאריך
            </label>
            <input
              className={styles.iteminput}
              type="text"
              placeholder="היום"
            />
            <p className={styles.date}>DD/MM/YYYY : פורמט</p>
          </div>

          <div className={styles.selectwrapper}>
            <label className={styles.label}>שם הכלב</label>

            <select className={styles.item} name="dog name" id="">
              <option value="">dog1</option>
              <option value="">dog2</option>
              <option value="">dog3</option>
            </select>
          </div>

          <div className={styles.selectwrapper}>
            <label className={styles.label} htmlFor="">
              שם מאמן
            </label>

            <select className={styles.item} name="trainer name" id="">
              <option value="">trainer1</option>
              <option value="">trainer2</option>
              <option value="">trainer3</option>
            </select>
          </div>

          <div className={styles.selectwrapper}>
            <label className={styles.label} htmlFor="">
              מספר שליחות
            </label>
            <select
              className={styles.item}
              name="number of trials"
              id=""
              defaultValue="10"
              onChange={(e) => setTrials(Number(e.target.value))}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.selectwrapper}>
            <label className={styles.label} htmlFor="">
              סוגי מכולות
            </label>

            <select className={styles.item} name="x" id="">
              <option value="">1</option>
              <option value="">2</option>
              <option value="">3</option>
            </select>
          </div>

          <div className={styles.checkbox}>
            <label className={styles.label}>X קיימת שליחה</label>
            <input type="checkbox" />
          </div>
        </form>
        <Link to="/training_plan">
          <button className={styles.button}>ערוך תוכנית אימון</button>
        </Link>
      </div>
      <NavBar />
    </div>
  );
}

export default NewSession;
