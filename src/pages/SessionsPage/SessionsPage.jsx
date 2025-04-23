import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import styles from './SessionsPage.module.css';

import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import SessionsList from '../../components/SessionsList/SessionsList';
import Calendar from '../../components/Calendar/Calendar';
import { handleUnauthorized } from '../../utils/auth';

Modal.setAppElement('#root');

function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionNumber, setSelectedSessionNumber] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchSessions = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/login');
        return;
      }

      try {
        const idsResponse = await fetch(`/api/Session/byUserId/${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!idsResponse.ok) throw new Error('Failed to fetch sessions');

        const sessionsData = await idsResponse.json();
        setSessions([]);
        if (isMounted) setLoading(false);
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

            if (
              statusResponse.status === 401 ||
              dPrimeResponse.status === 401
            ) {
              handleUnauthorized(navigate);
              return;
            }

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
                if (dogResponse.status === 401) {
                  handleUnauthorized(navigate);
                  return;
                }

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
            if (isMounted) {
              setSessions((prev) => [
                ...prev,
                { ...session, status, dogName, dPrime },
              ]);
            }
          } catch (error) {
            console.error(`Error processing session ${session.id}:`, error);
          }
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSessions();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  function openModal(session) {
    setSelectedSession(session);
    setSelectedSessionNumber(session.dogSessionNumber);
    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedSession(null);
    setIsModalOpen(false);
  }

  async function handleDeleteSession() {
    if (!selectedSession) return;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`/api/Session/${selectedSession.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        handleUnauthorized(navigate);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      setSessions((prevSessions) => {
        const updated = prevSessions.filter((s) => s.id !== selectedSession.id);

        return updated;
      });

      closeModal();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }

  return (
    <div className="container">
      <Header>האימונים שלי</Header>
      <Calendar />
      {loading ? (
        <div className={styles.loader}>טוען נתונים...</div>
      ) : (
        <SessionsList
          sessions={sessions}
          onDelete={(session) => openModal(session)}
        />
      )}
      <NavBar />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <p className={styles.titleModal}>
          האם אתה בטוח שברצונך למחוק את {selectedSessionNumber}{' '}
          {selectedSession?.dogName}?
        </p>
        <div className={styles.modalActions}>
          <button className={styles.btnYes} onClick={handleDeleteSession}>
            אישור
          </button>
          <button className={styles.btnNo} onClick={closeModal}>
            ביטול
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default SessionsPage;
