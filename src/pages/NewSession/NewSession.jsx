import styles from './NewSession.module.css';
import NavBar from '../../components/NavBar/NavBar';
import Header from '../../components/Header/Header';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NewSession({ setTrials, trials }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dogId, setDogId] = useState('');
  const [trainer, setTrainer] = useState('');
  const [containerType, setContainerType] = useState('');
  const [sendX, setSendX] = useState(false);
  const [finalResults, setFinalResults] = useState([]);
  const [dPrimeScore, setDPrimeScore] = useState(0);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const sessionData = {
      id: 0,
      dogId: Number(dogId),
      trainer,
      date: new Date().toISOString(),
      numberOfSends: trials,
      containerType: Number(containerType),
      sendX,
      finalResults,
      dPrimeScore: Number(dPrimeScore),
    };

    //delete
    console.log('Отправляемые данные на сервер:', sessionData);

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
          sessionId: 3, //change it later
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
      <div>
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
              <option value="1">dog1</option>
              <option value="2">dog2</option>
              <option value="3">dog3</option>
            </select>
          </div>

          <div className={styles.selectwrapper}>
            <label className={styles.label} htmlFor="">
              שם מאמן
            </label>

            <select
              className={styles.item}
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
            >
              <option value="1">trainer1</option>
              <option value="2">trainer2</option>
              <option value="3">trainer3</option>
            </select>
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

            <select
              className={styles.item}
              value={containerType}
              onChange={(e) => setContainerType(Number(e.target.value))}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div className={styles.checkbox}>
            <label className={styles.label}>X קיימת שליחה</label>
            <input
              type="checkbox"
              checked={sendX}
              onChange={(e) => setSendX(e.target.checked)}
            />
          </div>
          <button type="submit" className={styles.button}>
            שמור אימון
          </button>
        </form>
      </div>
      <NavBar />
    </div>
  );
}

export default NewSession;
