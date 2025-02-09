import styles from './SessionItem.module.css';

function SessionItem({ session }) {
  console.log(session);
  return (
    <li className={styles.itemwrapper}>
      <div className={styles.namewrapper}>
        <p className={styles.name}>
          {session.name}: אימון {session.session}
        </p>
        <span
          className={`${styles['status-icon']} ${
            session.status ? styles.ready : styles.inprocess
          }`}
        ></span>
      </div>

      <div className={styles.wrapper}>
        <button className={styles.button}>{session.button}</button>
        <button className={styles.count} disabled>
          ד-פריים {session.count}
        </button>
      </div>
    </li>
  );
}

export default SessionItem;
