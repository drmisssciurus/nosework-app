import { useState } from 'react';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';

import styles from './TrainingPlan.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

function TrainingPlan() {
  const location = useLocation();
  const navigate = useNavigate();

  const { sessionId, containerType, trials } = location.state || {};

  const fixedSessionId = 3;

  // const arrX = ['חיובי', 'ביקורת', 'שלילי'];
  // const backgroundColors = {
  //   חיובי: '#c3f2cb',
  //   ביקורת: '#ffdcaa',
  //   שלילי: '#ffb9c6',
  // };

  const arrX = containerType === 2 ? ['1', '2'] : ['1', '2', '3'];
  const backgroundColors = {
    1: '#c3f2cb',
    2: '#ffdcaa',
    3: '#ffb9c6',
  };

  // Состояние для хранения выбранных значений
  const [selectedValues, setSelectedValues] = useState(
    Array.from({ length: trials }, () => Array(3).fill(''))
  );

  // Обработчик изменения
  const handleChange = (trialIndex, selectIndex, event) => {
    const newValues = [...selectedValues];
    newValues[trialIndex][selectIndex] = event.target.value;
    setSelectedValues(newValues);
  };

  //рандомное заполнение
  const fillRandomly = () => {
    const randomValues = Array.from({ length: trials }, () => {
      const filledRow = Array(3).fill('');
      const usedIndexes = new Set();
      arrX.forEach((value) => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * 3);
        } while (usedIndexes.has(randomIndex));
        usedIndexes.add(randomIndex);
        filledRow[randomIndex] = value;
      });
      return filledRow;
    });
    setSelectedValues(randomValues);
  };

  const handleSubmit = async () => {
    console.log('sessionId перед отправкой:', sessionId);
    console.log('trials перед отправкой:', trials);

    const trainingData = selectedValues.map((trial, index) => ({
      id: 0, // Временно 0, пока сервер не вернёт ID
      sendNumber: Math.min(index + 1, trials), // Ограничение по количеству отправок
      positiveLocation: trial.includes('1') ? trial.indexOf('1') + 1 : 0,
      negativeLocation: trial.includes('2') ? trial.indexOf('2') + 1 : 0,
      sessionId: fixedSessionId,
    }));

    console.log(
      'Отправляемые данные на сервер:',
      JSON.stringify(trainingData, null, 2)
    );

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/TrainingProgram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trainingData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка при отправке данных: ${response.status}`);
      }
      alert('Данные успешно сохранены!');
      navigate('/trials');
    } catch (error) {
      console.error('Ошибка при запросе:', error);
      alert(error.message);
    }
  };

  return (
    // <div className={styles.containerNewSession}>
    <div className="container">
      <div className={styles.containerNewSession}>
        <Header>יצירת תוכנית אימון</Header>
        <div className={styles.containers}>
          <p className={styles.target}>סניפר 3</p>
          <p className={styles.target}>סניפר 2</p>
          <p className={styles.target}>סניפר 1</p>
        </div>
        <div className={styles.wrapper}>
          {Array.from({ length: trials }, (_, index) => (
            <div key={index} className={styles.trial}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.selectWrapper}>
                  <select
                    className={styles.item}
                    value={selectedValues[index][i]}
                    onChange={(event) => handleChange(index, i, event)}
                    style={{
                      backgroundColor:
                        backgroundColors[selectedValues[index][i]] ||
                        '#00000014',
                    }}
                  >
                    <option value="" disabled></option>
                    {arrX.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <span className={styles.arrow}>⌄</span>
                </div>
              ))}
              <h3 className={styles.number}>{index + 1}</h3>
            </div>
          ))}
        </div>
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={handleSubmit}>
            המשך
          </button>
          <button className={styles.button} onClick={fillRandomly}>
            מילוי רנדומלי
          </button>
        </div>
        <NavBar />
      </div>
    </div>
  );
}

export default TrainingPlan;
