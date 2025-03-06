import { useState } from 'react';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';

import styles from './TrainingPlan.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

function TrainingPlan() {
  const location = useLocation();
  const navigate = useNavigate();

  const { sessionId, containerType, trials } = location.state || {};

  const arrX =
    containerType === 0 ? ['חיובי', 'ביקורת'] : ['שלילי', 'חיובי', 'ביקורת'];
  const backgroundColors = {
    חיובי: '#c3f2cb',
    ביקורת: '#ffdcaa',
    שלילי: '#ffb9c6',
  };

  const [selectedValues, setSelectedValues] = useState(
    Array.from({ length: trials }, () => Array(3).fill(''))
  );

  const handleChange = (trialIndex, selectIndex, event) => {
    const newValues = [...selectedValues];
    newValues[trialIndex][selectIndex] = event.target.value;
    setSelectedValues(newValues);
  };

  const fillRandomly = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Error: Missing authorization token');
        return;
      }

      const response = await fetch(`/api/TrainingProgram/Random/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error loading data: ${response.statusText}`);
      }

      const data = await response.json();

      //delete
      console.log('Ответ API:', data);

      const transformedData = data.map((item) => {
        let row = Array(3).fill('');

        const posIndex = item.positiveLocation - 1;
        const negIndex = item.negativeLocation - 1;

        if (posIndex >= 0 && posIndex < 3) {
          row[posIndex] = 'חיובי';
        }
        if (negIndex >= 0 && negIndex < 3) {
          row[negIndex] = 'שלילי';
        }

        row = row.map((value) => (value === '' ? 'ביקורת' : value));

        return row;
      });
      //delete
      console.log('Преобразованные данные:', transformedData);
      setSelectedValues(transformedData);
    } catch (error) {
      console.error('Error getting random values:', error);
    }
  };

  const handleSubmit = async () => {
    //delete
    console.log('sessionId перед отправкой:', sessionId);
    console.log('trials перед отправкой:', trials);

    const trainingData = selectedValues.map((trial, index) => {
      const mappedIndexes = {
        0: 1,
        1: 2,
        2: 3,
      };

      return {
        id: 0,
        trialNumber: Math.min(index + 1, trials),
        positiveLocation: trial.includes('חיובי')
          ? mappedIndexes[trial.indexOf('חיובי')] // Преобразуем индекс
          : 0,
        negativeLocation: trial.includes('שלילי')
          ? mappedIndexes[trial.indexOf('שלילי')] // Преобразуем индекс
          : 0,
        sessionId: sessionId || 0,
      };
    });

    //delete
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
        throw new Error(`Error sending data: ${response.status}`);
      }
      alert('Data saved successfully!'); //for testing
      navigate('/trials', { state: { trainingData } });
    } catch (error) {
      console.error('Error while requesting:', error);
      alert(error.message);
    }
  };

  //delete
  console.log('Текущее состояние selectedValues:', selectedValues);

  return (
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
              {[...Array(3)].map((_, i, arr) => {
                const reversedIndex = arr.length - 1 - i; // Разворачиваем порядок select

                return (
                  <div key={reversedIndex} className={styles.selectWrapper}>
                    <select
                      className={styles.item}
                      value={selectedValues[index][reversedIndex]} // Используем перевернутый индекс
                      onChange={(event) =>
                        handleChange(index, reversedIndex, event)
                      } // Передаем корректный индекс
                      style={{
                        backgroundColor:
                          backgroundColors[
                            selectedValues[index][reversedIndex]
                          ] || '#00000014',
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
                );
              })}
              <h3 className={styles.number}>{index + 1}</h3>
            </div>
          ))}
        </div>

        <div className={styles.buttonWrapper}>
          <Button className={styles.btnStart} onClick={handleSubmit}>
            המשך
          </Button>
          <Button
            className={styles.btnRandom}
            onClick={() => fillRandomly(sessionId)}
          >
            מילוי רנדומלי
          </Button>
        </div>
        <NavBar />
      </div>
    </div>
  );
}

export default TrainingPlan;
