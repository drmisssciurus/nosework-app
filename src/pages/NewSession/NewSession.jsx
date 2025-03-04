import styles from './NewSession.module.css';
import NavBar from '../../components/NavBar/NavBar';
import Header from '../../components/Header/Header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

function NewSession({ setTrials, trials }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dogId, setDogId] = useState('');
  const [dogs, setDogs] = useState([]);
  const [trainer, setTrainer] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [newTrainer, setNewTrainer] = useState('');
  const [isAddingTrainer, setIsAddingTrainer] = useState(false);
  const [containerType, setContainerType] = useState('');
  const [trialX, setTrialX] = useState(false);
  const [finalResults, setFinalResults] = useState([]);
  const [dPrimeScore, setDPrimeScore] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/api/Trainer', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Тренеры:', data);
        setTrainers(data);
      })
      .catch((err) => console.error('Error to upload trainers: ', err));

    fetch('/api/Dog', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Dogs: ', data);
        setDogs(data);
      })
      .catch((err) => console.error('Error to upload dogs: ', err));
  }, []);

  function handleTrainerChange(e) {
    const value = e.target.value;
    if (value === 'add_new') {
      setIsAddingTrainer(true);
      setTrainer('');
    } else {
      setIsAddingTrainer(false);
      setTrainer(value);
    }
  }

  function handleAddTrainer() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: There is no token');
      return;
    }

    if (newTrainer.trim()) {
      fetch('/api/Trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTrainer),
      })
        .then(() => {
          setTrainers([...trainers, newTrainer]);
          setTrainer(newTrainer);
          setNewTrainer('');
          setIsAddingTrainer(false);
        })
        .catch((err) => console.error('Error adding trainer:', err));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const sessionData = {
      id: 0,
      dogId: Number(dogId),
      trainer,
      date: new Date().toISOString(),
      numberOfTrials: trials,
      containerType: Number(containerType),
      trialX,
      finalResults,
      dPrimeScore: Number(dPrimeScore),
    };

    //delete
    console.log('Отправляемые данные на сервер:', sessionData);
    console.log('trialX перед отправкой:', trialX);

    const token = localStorage.getItem('token');

    //delete

    console.log('Отправляемый токен:', token);

    try {
      const response = await fetch('/api/Session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authorization error: token is invalid or missing.');
        }
        throw new Error(`Error sending data: ${response.status}`);
      }

      const responseData = await response.json();
      //delete
      console.log('Ответ от сервера:', responseData);
      console.log('containerType перед навигацией:', containerType);

      navigate('/training_plan', {
        state: {
          sessionId: responseData.id || 0, //change it later
          containerType: Number(containerType),
          trials: trials,
        },
      });
    } catch (error) {
      console.error('Error request', error);
      alert(error.message);
    }
  }

  return (
    <div className="container">
      <div className={styles.newSession}>
        <Header>הוספת אימון חדש</Header>
        <p className={styles.sessionname}>אימון מספר 19</p>
        <p className={styles.sessionsubtitle}>
          מספר מעודכן אוטומטית לפי הכלב המתאמן
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.itemwrapper}>
            <label className={styles.label}>תאריך</label>
            <input
              className={styles.iteminput}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <p className={styles.date}>DD/MM/YYYY : פורמט</p>
          </div>

          <div className={styles.selectwrapper}>
            <label className={styles.label}>שם הכלב</label>

            <select
              className={styles.item}
              value={dogId}
              onChange={(e) => setDogId(e.target.value)}
            >
              <option value="">בחר כלב</option>
              {dogs.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectwrapper}>
            <label className={styles.label} htmlFor="">
              שם מאמן
            </label>

            <select
              className={styles.item}
              value={trainer}
              onChange={handleTrainerChange}
            >
              <option value="">לבחור מאמן</option>
              {trainers.map((trainer, index) => (
                <option key={index} value={trainer}>
                  {trainer}
                </option>
              ))}
              <option value="add_new">הוסף מאמן</option>
            </select>
            {isAddingTrainer && (
              <div className={styles.addTrainer}>
                <input
                  className={styles.item}
                  type="text"
                  value={newTrainer}
                  onChange={(e) => setNewTrainer(e.target.value)}
                  placeholder="new trainer name"
                />
                <Button type="button" onClick={handleAddTrainer}>
                  add trainer
                </Button>
              </div>
            )}
          </div>

          <div className={styles.selectwrapper}>
            <label className={styles.label} htmlFor="">
              מספר שליחות
            </label>
            <select
              className={styles.item}
              value={trials}
              onChange={(e) => setTrials(Number(e.target.value))}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.selectwrapper}>
            <label className={styles.label} htmlFor="">
              סוגי מכולות
            </label>
            {/* smells variants: 1- smell and empty, 2 - smell, empty, negative */}
            <select
              className={styles.item}
              value={containerType}
              onChange={(e) => setContainerType(Number(e.target.value))}
            >
              <option value="0">חיובי-ביקורת</option>
              <option value="1">חיובי-שלילי-ביקורת</option>
            </select>
          </div>

          <div className={styles.checkbox}>
            <label className={styles.label}>X קיימת שליחה</label>
            <input
              type="checkbox"
              checked={trialX}
              onChange={(e) => setTrialX(e.target.checked)}
            />
          </div>
          <Button type="submit" className={styles.btnNewSession}>
            שמור אימון
          </Button>
        </form>
      </div>
      <NavBar />
    </div>
  );
}

export default NewSession;
