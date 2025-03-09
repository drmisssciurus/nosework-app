import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SessionItem.module.css';

function SessionItem({ session }) {
  const navigate = useNavigate();
  const [nextTrialNumber, setNextTrialNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  const { dogName, id, status, dPrime } = session;
  //delete
  console.log('dprime:', dPrime);

  useEffect(() => {
    const fetchTrials = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`/api/Trial/bySession/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch trials');

        const trials = await response.json();
        //delete

        console.log('trials:', trials);
        setNextTrialNumber(trials.length + 1);
      } catch (error) {
        console.error(`Error fetching trials for session ${id}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrials();
  }, [id]);

  return (
    <li className={styles.itemwrapper}>
      <div className={styles.namewrapper}>
        <p className={styles.name}>
          {dogName || 'Unknown'}: אימון {id}
        </p>
        <span
          className={`${styles['status-icon']} ${
            status === 'Completed' ? styles.ready : styles.inprocess
          }`}
        ></span>
      </div>

      <div className={styles.wrapper}>
        {status === 'InProgress' ? (
          <button
            className={styles.buttonInProg}
            onClick={() =>
              navigate('/continue_trials', {
                state: { sessionId: id, nextTrialNumber },
              })
            }
            disabled={loading}
          >
            {loading ? 'טוען...' : 'המשך אימון'}
          </button>
        ) : (
          <button
            className={styles.button}
            onClick={() => navigate(`/session_overview/${id}`)}
          >
            ראה נתונים
          </button>
        )}
        {dPrime === undefined ? (
          <p className={styles.dPrimeInProg}>אימון בתהליך</p>
        ) : (
          <p className={styles.dPrime}>ד-פריים {dPrime?.toFixed(3) ?? '—'}</p>
        )}
      </div>
    </li>
  );
}

export default SessionItem;
