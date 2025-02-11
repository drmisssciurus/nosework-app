import styles from './Dogs.module.css';
import dogImage from '../../assets/dogs/dog_1.png';

function Dogs() {
  return (
    <>
      <li className={styles.item}>
        <div className={styles.imageContainer}>
          <img src={dogImage} alt="" />
        </div>
        <div>
          <p className={`${styles.text} ${styles.name}`}>dog name</p>
          <p className={`${styles.text} ${styles.breed}`}>dog breed</p>
          <p className={`${styles.text} ${styles.age}`}>dog age</p>
        </div>
      </li>

      <li className={styles.item}>
        <div>
          <img src={dogImage} alt="" />
        </div>
        <div>
          <p className={`${styles.text} ${styles.name}`}>dog name</p>
          <p className={`${styles.text} ${styles.breed}`}>dog breed</p>
          <p className={`${styles.text} ${styles.age}`}>dog age</p>
        </div>
      </li>
    </>
  );
}

export default Dogs;
