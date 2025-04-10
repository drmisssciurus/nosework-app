import styles from './Dogs.module.css';
import { formatDogAge } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

function Dogs({ dogs, onDelete }) {
  const navigate = useNavigate();

  return (
    <>
      {dogs.map(({ id, name, breed, age, imageUrl, hasSessions }) => (
        <li key={id} className={styles.item}>
          <div className={styles.imageContainer}>
            {imageUrl ? (
              <img className={styles.image} src={imageUrl} alt={name} />
            ) : (
              <span className={styles.fallbackText}>{name}</span>
            )}
          </div>
          <div className={styles.wrapperDescription}>
            <div>
              <p className={`${styles.text} ${styles.name}`}>{name}</p>
              <p className={`${styles.text} ${styles.breed}`}>{breed}</p>
              <p className={`${styles.text} ${styles.age}`}>
                {formatDogAge(age)}
              </p>
            </div>
            <div className={styles.btnWrapper}>
              <button
                className={styles.deleteBtn}
                onClick={() => navigate(`/dog_analysis/${id}`)}
                disabled={!hasSessions}
              >
                ביצועי כלב
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => onDelete({ id, name })}
              >
                מחק כלב
              </button>
            </div>
          </div>
        </li>
      ))}
    </>
  );
}

export default Dogs;
