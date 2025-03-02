import styles from './Dogs.module.css';
import dogImage from '../../assets/dogs/dog_1.png';
import { formatDogAge } from '../../utils/utils';

function Dogs({ dogs }) {
  return (
    <>
      {dogs.map(({ id, name, breed, age }) => (
        <li key={id} className={styles.item}>
          <div className={styles.imageContainer}>
            <img src={dogImage} alt="" />
          </div>
          <div>
            <p className={`${styles.text} ${styles.name}`}>{name}</p>
            <p className={`${styles.text} ${styles.breed}`}>{breed}</p>
            <p className={`${styles.text} ${styles.age}`}>
              {formatDogAge(age)}
            </p>
          </div>
        </li>
      ))}
    </>
  );
}

export default Dogs;
