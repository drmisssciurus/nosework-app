import styles from './SessionsList.module.css';
import SessionItem from '../SessionItem/SessionItem';

function SessionsList({ sessions, onDelete }) {
  return (
    <ul className={styles.wrapper}>
      {sessions.map((session, index) => (
        <SessionItem
          session={session}
          key={session.id}
          index={index}
          onDelete={() => onDelete(session, index)}
          total={sessions.length}
        />
      ))}
    </ul>
  );
}
export default SessionsList;
