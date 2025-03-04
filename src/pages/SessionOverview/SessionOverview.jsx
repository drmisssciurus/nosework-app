import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';

import styles from './SessionOverview.module.css';

function SessionOverview() {
  return (
    <div className="container">
      <Header>סקירת אימון</Header>
      <div className={styles.container}>
        <div className={styles.sessionOverviewPanel}>
          <div className={styles.infoContainer}>
            <div className={styles.titleWrapper}>
              <p className={styles.title}>תוכנית אימון</p>
            </div>
            <div>
              <p className={styles.title}>כלב: טאץ</p>
              <p className={styles.title}>אימון מספר: 15</p>
              <p className={styles.title}>תאריך: אוקטובר, 11, 2024</p>
            </div>
          </div>
          <div className={styles.dprimeWrapper}>
            <p className={styles.dprime}>2.506</p>
            <p className={styles.dprimeTitle}>די פריים</p>
          </div>
        </div>

        <div className={styles.trialOverview}>
          <div className={styles.videoContainer}>
            <video className={styles.video} src="#"></video>
          </div>
          <div className={styles.trialInfoContainer}>
            <p className={styles.trialNumber}>שליחה</p>
            <div className={styles.resultWrapper}>
              <p>res</p>
              <p className={styles.result}>תוצאה</p>
            </div>
            <Button className={styles.trialBtn}>הצג ניתוח</Button>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  );
}

export default SessionOverview;
