import styles from './SessionItem.module.css';

function SessionItem({ session }) {
  return (
    <li>
      <div className={styles.namewrapper}>
        <p className={styles.name}>
          {session.name}: אימון {session.session}
        </p>
        <span>&#xa9;</span>
      </div>

      <div className={styles.wrapper}>
        <button className={styles.button}>{session.button}</button>
        <p className={styles.count}>ד-פריים {session.count}</p>
      </div>
    </li>
  );
}

export default SessionItem;
