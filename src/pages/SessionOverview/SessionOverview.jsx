import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styles from './SessionOverview.module.css';

import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';

function SessionOverview() {
  const { sessionId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [dogName, setDogName] = useState(null);
  const [DPrimeScore, setDPrimeScore] = useState(null);
  const [trials, setTrials] = useState([]);

  const resultColors = {
    H: '#22c55e',
    M: '#ff3b30',
    FA: '#ff3b30',
    CR: '#22c55e',
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      setIsLoading(true);

      try {
        const response = await fetch(`/api/Session/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch session data');

        const session = await response.json();
        setSessionData(session);

        const [dogResponse, dPrimeResponse, trialsResponse] = await Promise.all(
          [
            fetch(`/api/Dog/${session.dogId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`/api/Session/dprime/${session.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`/api/Trial/bySession/${session.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]
        );

        if (dogResponse.ok) {
          const dogData = await dogResponse.json();
          setDogName(dogData.name);
        }

        if (dPrimeResponse.ok) {
          const dPrimeData = await dPrimeResponse.json();
          setDPrimeScore(dPrimeData.dPrime);
        }

        if (trialsResponse.ok) {
          const trialsData = await trialsResponse.json();
          setTrials(trialsData);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  if (loading) return <p className={styles.loader}>🔄 טוען נתונים...</p>;
  if (!sessionData)
    return <p className={styles.error}>❌ שגיאה בטעינת הנתונים</p>;

  const formattedData = new Date(sessionData.date).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container">
      <Header>סקירת אימון</Header>

      {isLoading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loader}></div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.sessionOverviewPanel}>
          <div className={styles.infoContainer}>
            <div className={styles.titleWrapper}>
              <p className={styles.title}>תוכנית אימון</p>
            </div>
            <div>
              <p className={styles.title}>
                כלב: {dogName} <br /> שם מאמן: {sessionData.trainer}
              </p>
              <p className={styles.title}>אימון מספר: {sessionData.id}</p>
              <p className={styles.title}>תאריך: {formattedData}</p>
            </div>
          </div>
          <div className={styles.dprimeWrapper}>
            <p className={styles.dprime}>{DPrimeScore?.toFixed(3)}</p>
            <p className={styles.dprimeTitle}>די פריים</p>
          </div>
        </div>

        {/* Trials */}
        <div className={styles.trialWrapper}>
          {trials.length > 0 ? (
            trials.map((trial, index) => (
              <div key={trial.id} className={styles.trialOverview}>
                <div className={styles.videoContainer}>
                  <video
                    className={styles.video}
                    src={trial.videoUrl || '#'}
                    controls
                  ></video>
                </div>
                <div className={styles.trialInfoContainer}>
                  <p className={styles.trialNumber}>שליחה {index + 1}</p>
                  <div className={styles.resultWrapper}>
                    <p
                      className={styles.resultResult}
                      style={{ color: resultColors[trial.result] || 'black' }}
                    >
                      {trial.result || '—'}
                    </p>
                    <p className={styles.result}>תוצאה</p>
                  </div>
                  <Button className={styles.trialBtn} disabled>
                    הצג ניתוח
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noTrials}>אין שליחות זמינות</p>
          )}
        </div>
      </div>
      <NavBar />
    </div>
  );
}

export default SessionOverview;
