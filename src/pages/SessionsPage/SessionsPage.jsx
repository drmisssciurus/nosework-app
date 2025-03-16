import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import SessionsList from '../../components/SessionsList/SessionsList';
import { useNavigate } from 'react-router-dom';
import styles from './SessionsPage.module.css';
import Calendar from '../../components/Calendar/Calendar';

function SessionsPage() {
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

  return (
    <div>
      <Header>האימונים שלי</Header>
      <Calendar />
      {loading ? (
        <div className={styles.loader}>טוען נתונים...</div>
      ) : (
        <SessionsList sessions={sessions} />
      )}
      <NavBar />
    </div>
  );
}

export default SessionsPage;
