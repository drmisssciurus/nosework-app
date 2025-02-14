import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';

import styles from './AddDog.module.css';

function AddDog() {
  return (
    <div className="container">
      <div>
        <Header>הוספת כלב חדש</Header>
        <form action="" className={styles.wrapper}>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="">
              שם הכלב
            </label>
            <input
              className={styles.iteminput}
              type="text"
              placeholder="הכנס שם הכלב"
            />
          </div>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="">
              גזע
            </label>
            <input
              className={styles.iteminput}
              type="text"
              placeholder="הכנס גזע"
            />
          </div>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="">
              תאריך לידה
            </label>
            <input
              className={styles.iteminput}
              type="text"
              placeholder="הכנס תאריך לידה"
            />
          </div>
        </form>
        <NavBar />
      </div>
    </div>
  );
}

export default AddDog;
