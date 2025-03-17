import styles from './Dogs.module.css';
import { formatDogAge } from '../../utils/utils';

function Dogs({ dogs, onDelete }) {
  return (
    <>
      {dogs.map(({ id, name, breed, age, imageUrl }) => (
        <li key={id} className={styles.item}>
          <div className={styles.imageContainer}>
            <img className={styles.image} src={imageUrl} alt="" />
          </div>
          <div className={styles.wrapperDescription}>
            <div>
              <p className={`${styles.text} ${styles.name}`}>{name}</p>
              <p className={`${styles.text} ${styles.breed}`}>{breed}</p>
              <p className={`${styles.text} ${styles.age}`}>
                {formatDogAge(age)}
              </p>
            </div>
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete({ id, name })}
            >
              מחק כלב
            </button>
          </div>
        </li>
      ))}
    </>
  );
}

export default Dogs;
