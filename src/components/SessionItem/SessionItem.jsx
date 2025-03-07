import { useNavigate } from 'react-router-dom';
import styles from './SessionItem.module.css';

function SessionItem({ session }) {
  const navigate = useNavigate();
  if (!session) {
    return null;
  }

  console.log(session);
  const { dogName, id, status, dPrime } = session;

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
          <button className={styles.buttonInProg}>המשך אימון</button>
        ) : (
          <button
            className={styles.button}
            onClick={() => navigate(`/session_overview/${id}`)}
          >
            ראה נתונים
          </button>
        )}
        {dPrime === 0 ? (
          <p className={styles.dPrimeInProg}>אימון בתהליך</p>
        ) : (
          <p className={styles.dPrime}>ד-פריים {dPrime.toFixed(3) ?? '—'}</p>
        )}
      </div>
    </li>
  );
}

export default SessionItem;
