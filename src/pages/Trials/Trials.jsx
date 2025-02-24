import { Link, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import styles from './Trials.module.css';

function Trials() {
  const location = useLocation();
  const { trainingData } = location.state || { trainingData: [] };
  console.log(trainingData);

  const containersColors = {
    positive: '#22c55e',
    negative: '#ff3b30',
    empty: '#ff9500',
  };

  return (
    <div className="container">
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <h1 className={styles.trialNumber}>{`שליחה #${
            trainingData.length > 0 ? trainingData[0].sendNumber : '?'
          }`}</h1>
        </header>
        <div className={styles.containers}>
          {trainingData.length > 0 &&
            [3, 2, 1].map((containerIndex) => {
              const trial = trainingData[0];
              let color = containersColors.empty;
              if (trial.positiveLocation === containerIndex)
                color = containersColors.positive;
              if (trial.negativeLocation === containerIndex)
                color = containersColors.negative;

              return (
                <div
                  key={containerIndex}
                  className={styles.container}
                  style={{ color }}
                >
                  <p className={styles.boxName}>{`סניפר ${containerIndex}`}</p>
                  <p>
                    {trial.positiveLocation === containerIndex
                      ? 'חיובי'
                      : trial.negativeLocation === containerIndex
                      ? 'שלילי'
                      : 'ביקורת'}
                  </p>
                </div>
              );
            })}
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
            {['סניפר 1', 'סניפר 2', 'סניפר 3', 'אין בחירה'].map((name, i) => (
              <div className={styles.item} key={i}>
                <p className={styles.itemName}>{name}</p>
                <input type="radio" name="finalChoise" />
              </div>
            ))}
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
