import styles from './SessionsList.module.css';
import SessionItem from '../SessionItem/SessionItem';

function SessionsList({ sessions, onDelete }) {
  return (
    <ul className={styles.wrapper}>
      {sessions.map((session) => (
        <SessionItem session={session} key={session.id} onDelete={onDelete} />
      ))}
    </ul>
  );
}
export default SessionsList;
