import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainPage.module.css';

import NavBar from '../../components/NavBar/NavBar';
import Calendar from '../../components/Calendar/Calendar';
import SessionsList from '../../components/SessionsList/SessionsList';
import Button from '../../components/Button/Button';

import logo from '../../assets/logo-dog.png';

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
        const validSessions = [];

        for (const session of sessionsData) {
          try {
            if (!session.id) {
              console.warn('Session missed without `session.id`:', session);
              continue;
            }

            const trainingResponse = await fetch(
              `/api/TrainingProgram/BySession/${session.id}`,
              {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (!trainingResponse.ok) {
              console.warn(
                `Session ${session.id} has no TrainingProgram. Deleting...`
              );

              await fetch(`/api/Session/${session.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });

              continue;
            }

            const [statusResponse, dPrimeResponse] = await Promise.all([
              fetch(`/api/Session/status/${session.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              fetch(`/api/Session/dprime/${session.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

            if (!statusResponse.ok || !dPrimeResponse.ok) {
              console.warn(
                `Failed to load session details (id: ${session.id})`
              );
              continue;
            }

            let dogName = 'כלב';
            if (session.dogId && session.dogId !== 0) {
              try {
                const dogResponse = await fetch(`/api/Dog/${session.dogId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (dogResponse.ok) {
                  const { name } = await dogResponse.json();
                  dogName = name;
                } else {
                  console.warn(
                    `Error loading dog data (dogId: ${session.dogId})`
                  );
                }
              } catch (dogError) {
                console.error(
                  `Error getting a dog(dogId: ${session.dogId}):`,
                  dogError
                );
              }
            }
            const { status } = await statusResponse.json();
            const { dPrime } = await dPrimeResponse.json();

            validSessions.push({ ...session, status, dogName, dPrime });
          } catch (error) {
            console.error(`Error processing session ${session.id}:`, error);
          }
        }

        setSessions(validSessions);
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
