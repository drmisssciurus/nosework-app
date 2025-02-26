import NavBar from '../../components/NavBar/NavBar';
import Header from '../../components/Header/Header';
import Dogs from '../../components/Dogs/Dogs';
import Button from '../../components/Button/Button';
import styles from './DogsList.module.css';
import { useNavigate } from 'react-router-dom';

function DogsList() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className={styles.content}>
        <Header>הכלבים שלנו</Header>

        <div>
          <ul className={styles.wrapper}>
            <Dogs />
          </ul>
        </div>

        <Button className={styles.btnDog} onClick={() => navigate('/add_dog')}>
          הוספת כלב חדש
        </Button>

        <NavBar />
      </div>
    </div>
  );
}

export default DogsList;
