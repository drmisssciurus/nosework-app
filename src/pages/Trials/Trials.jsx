import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import styles from './Trials.module.css';
import { useEffect, useState } from 'react';

function Trials() {
  const location = useLocation();
  const navigate = useNavigate();

  const [trainingData, setTrainingData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [targetScent, setTargetScent] = useState('');

  const trainingId =
    location.state?.trainingId ||
    location.state?.trainingData?.[0]?.sessionId ||
    null;

  //delete
  console.log('ID from training plan', trainingId);

  const containersColors = {
    positive: '#22c55e',
    negative: '#ff3b30',
    empty: '#ff9500',
  };

  const choicesMapping = {
    'סניפר 1': 1,
    'סניפר 2': 2,
    'סניפר 3': 3,
    'אין בחירה': 0,
  };

  useEffect(() => {
    async function fetchTrainingData() {
      if (!trainingId) return;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('There in no token');
        return;
      }

      try {
        const response = await fetch(
          `/api/TrainingProgram/BySession/${trainingId}`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`Fetching error: ${response.statusText}`);
        }

        const data = await response.json();

        console.log('I get this data:', data);
        setTrainingData(data);
      } catch (error) {
        console.error('Error fetching training data: ', error);
      }
    }
    fetchTrainingData();
  }, [trainingId]);

  const currentTrial = trainingData.length > 0 ? trainingData[0] : null;
  console.log(
    'current trial',
    currentTrial ? currentTrial.sendNumber : 'No trial data'
  );

  async function handleSubmit() {
    if (!currentTrial) {
      console.error('Error: there is no trial!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: There is no token');
      return;
    }

    const payload = {
      id: 0,
      trainingId: currentTrial.id,
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
      setTrainingData(updatedTrials);
      if (updatedTrials.length === 0) {
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
            {Object.entries(choicesMapping).map(([name, value]) => (
              <div className={styles.item} key={value}>
                <p className={styles.itemName}>{name}</p>
                <input
                  type="radio"
                  name="finalChoice"
                  value={value}
                  checked={selectedLocation === value}
                  onChange={() => {
                    setSelectedLocation(value);
                    console.log('Selected choice:', value);
                  }}
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
