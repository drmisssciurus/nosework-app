import { useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';

import styles from './SessionOverview.module.css';
import { useEffect, useState } from 'react';

function SessionOverview() {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dogName, setDogName] = useState(null);
  const [DPrimeScore, setDPrimeScore] = useState(null);
  console.log(sessionData);
  console.log(dogName);
  console.log(DPrimeScore);

  useEffect(() => {
    const fetchSessionData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Получаем данные сессии
        const response = await fetch(`/api/Session/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch session data');

        const session = await response.json();
        setSessionData(session);

        const [dogResponse, dPrimeResponse] = await Promise.all([
          fetch(`/api/Dog/${session.dogId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/Session/dprime/${session.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!dogResponse.ok || !dPrimeResponse.ok) {
          throw new Error('Failed to fetch dog name or dPrimeScore');
        }

        const { name: fetchedDogName } = await dogResponse.json();
        setDogName(fetchedDogName);

        const { dPrime: fetchedDPrimeScore } = await dPrimeResponse.json();
        setDPrimeScore(fetchedDPrimeScore);
      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setLoading(false);
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
            <p className={styles.dprime}>{DPrimeScore}</p>
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
