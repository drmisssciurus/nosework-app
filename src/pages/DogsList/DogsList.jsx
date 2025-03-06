import NavBar from '../../components/NavBar/NavBar';
import Header from '../../components/Header/Header';
import Dogs from '../../components/Dogs/Dogs';
import Button from '../../components/Button/Button';
import styles from './DogsList.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { calculateAge, formatDate } from '../../utils/utils';

function DogsList() {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDogs() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('There in no token');
        return;
      }
      try {
        const response = await fetch('/api/Dog', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Error data loading');
        }
        const data = await response.json();

        const formattedDogs = data.map((dog) => ({
          ...dog,
          age: calculateAge(dog.dateOfBirth),
          formattedDate: formatDate(dog.dateOfBirth),
        }));
        //delete
        console.log(formattedDogs);
        setDogs(formattedDogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDogs();
  }, []);

  return (
    <div className="container">
      <div className={styles.content}>
        <Header>הכלבים שלנו</Header>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <div>
            <ul className={styles.wrapper}>
              <Dogs dogs={dogs} />
            </ul>
          </div>
        )}

        <Button className={styles.btnDog} onClick={() => navigate('/add_dog')}>
          הוספת כלב חדש
        </Button>

        <NavBar />
      </div>
    </div>
  );
}

export default DogsList;
