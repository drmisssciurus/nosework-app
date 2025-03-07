import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from '../../components/NavBar/NavBar';
import Calendar from '../../components/Calendar/Calendar';
import SessionsList from '../../components/SessionsList/SessionsList';
import Button from '../../components/Button/Button';

import logo from '../../assets/logo-dog.png';
import styles from './MainPage.module.css';

const today = new Date().toLocaleDateString('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function MainPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/Session', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch sessions');

        const sessionsData = await response.json();

        // Загружаем статус и имя собаки для каждой сессии
        const updatedSessions = await Promise.all(
          sessionsData.map(async (session) => {
            try {
              const [statusResponse, dogResponse, dPrimeResponse] =
                await Promise.all([
                  fetch(`/api/Session/status/${session.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  }),
                  fetch(`/api/Dog/${session.dogId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  }),
                  fetch(`/api/Session/dprime/${session.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  }),
                ]);

              if (!statusResponse.ok || !dogResponse.ok || !dPrimeResponse.ok) {
                throw new Error('Failed to fetch session details');
              }

              const { status } = await statusResponse.json();
              const { name: dogName } = await dogResponse.json();
              const { dPrime } = await dPrimeResponse.json();

              console.log(dPrimeResponse);
              console.log('dPrimeScore', dPrime);

              return { ...session, status, dogName, dPrime };
            } catch (error) {
              console.error(
                `Error fetching details for session ${session.id}:`,
                error
              );
              return {
                ...session,
                status: 'InProgress',
                dogName: 'Unknown',
                dPrimeScore: null,
              };
            }
          })
        );

        setSessions(updatedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/User/Logout', { method: 'POST' });
    } catch (error) {
      console.error('Error while exiting:', error);
    }

    localStorage.removeItem('token');
    console.log('Token removed:', localStorage.getItem('token'));
    navigate('/login');
  };

  return (
    <div className="container">
      <div className={styles.mainPage}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <div>
            <h2 className={styles.text}>שלום,</h2>
            <h2 className={styles.text}>היום,{today}</h2>
          </div>
        </header>

        <Calendar />
        <main>
          <p className={styles.title}>האימונים שלי</p>

          {loading ? (
            <div className={styles.loader}>טוען נתונים...</div>
          ) : (
            <SessionsList sessions={sessions} />
          )}

          <div className={styles.btnWrapper}>
            <Button
              className={styles.btn}
              onClick={() => navigate('/create_session')}
            >
              צור תוכנית אימון
            </Button>

            <Button className={styles.btnLogout} onClick={handleLogout}>
              התנתק
            </Button>
          </div>
        </main>

        <NavBar />
      </div>
    </div>
  );
}

export default MainPage;
