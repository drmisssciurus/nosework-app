import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import styles from './Trials.module.css';
import { useEffect, useState } from 'react';

function Trials() {
  const location = useLocation();
  const navigate = useNavigate();

  const trainingData = location.state?.trainingData || [];
  const trainingId = trainingData.length > 0 ? trainingData[0].sessionId : null; // Используем sessionId как trainingId

  //delete
  console.log('my data', trainingData);
  //delete
  useEffect(() => {
    console.log('Location state:', location.state); // Логирование для отладки
  }, [location.state]);

  const [selectedLocation, setSelectedLocation] = useState(0);
  const [targetScent, setTargetScent] = useState('');

  const currentTrial = trainingData.length > 0 ? trainingData[0] : null;
  console.log('current trial', currentTrial.sendNumber);

  const containersColors = {
    positive: '#22c55e',
    negative: '#ff3b30',
    empty: '#ff9500',
  };

  async function handleSubmit() {
    if (!currentTrial || trainingId === null) {
      console.error('Ошибка: trainingId не найден или trial отсутствует');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('There is no token');
      return;
    }

    const payload = {
      id: 0,
      trainingId: trainingId,
      selectedLocation,
      targetScent: targetScent.trim() === '' ? '' : targetScent,
      result: 'completed',
    };

    console.log('Отправляемые данные:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch('/api/Send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Sending error: ${response.statusText}`);
      }

      console.log('Data send: ', payload);

      const updatedTrials = trainingData.slice(1);
      if (updatedTrials.length > 0) {
        navigate('/trials', {
          state: { trainingData: updatedTrials, trainingId: trainingId },
        });
      } else {
        navigate('/end_session');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  return (
    <div className="container">
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <h1 className={styles.trialNumber}>{`שליחה #${
            currentTrial ? currentTrial.sendNumber : '?'
          }`}</h1>
        </header>
        <div className={styles.containers}>
          {currentTrial &&
            [3, 2, 1].map((containerIndex) => {
              let color = containersColors.empty;
              if (currentTrial.positiveLocation === containerIndex)
                color = containersColors.positive;
              if (currentTrial.negativeLocation === containerIndex)
                color = containersColors.negative;

              return (
                <div
                  key={containerIndex}
                  className={styles.container}
                  style={{ color }}
                >
                  <p className={styles.boxName}>{`סניפר ${containerIndex}`}</p>
                  <p>
                    {currentTrial.positiveLocation === containerIndex
                      ? 'חיובי'
                      : currentTrial.negativeLocation === containerIndex
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
            id="targetScent"
            placeholder="שם הריח פה"
            value={targetScent}
            onChange={(e) => setTargetScent(e.target.value)}
          />
        </div>
        <div className={styles.checkboxes}>
          <p className={styles.checkbLabel}>הסימון הסופי</p>
          <div className={styles.checkbWrapper}>
            {['סניפר 1', 'סניפר 2', 'סניפר 3', 'אין בחירה'].map((name, i) => (
              <div className={styles.item} key={i}>
                <p className={styles.itemName}>{name}</p>
                <input
                  type="radio"
                  name="finalChoice"
                  value={i}
                  checked={selectedLocation === i}
                  onChange={() => setSelectedLocation(i)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btn} onClick={handleSubmit}>
            שליחה הבאה
          </button>
          <button className={styles.btn} onClick={() => navigate('/mainpage')}>
            חזרה למסך הבית
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Trials;
