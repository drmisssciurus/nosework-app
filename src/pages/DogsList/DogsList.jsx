import NavBar from '../../components/NavBar/NavBar';
// import styles from './DogsList.module.css';
import Header from '../../components/Header/Header';
import Dogs from '../../components/Dogs/Dogs';
import styles from './DogsList.module.css';
import { Link } from 'react-router-dom';

function DogsList() {
  return (
    <div className="container">
      <div className={styles.content}>
        <Header>הכלבים שלנו</Header>

        <div>
          <ul className={styles.wrapper}>
            <Dogs />
          </ul>
        </div>
        <Link to="/add_dog">
          <button className={styles.button}>הוספת כלב חדש</button>
        </Link>

        <NavBar />
      </div>
    </div>
  );
}

export default DogsList;
