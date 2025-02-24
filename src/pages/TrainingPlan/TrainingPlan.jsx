import { useState } from 'react';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';

import styles from './TrainingPlan.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const fillRandomly = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Ошибка: отсутствует токен авторизации');
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
        throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Ответ API:', data);

      // Преобразуем ответ в нужный формат
      const transformedData = data.map((item) => {
        let row = Array(3).fill(''); // Создаем пустую строку из 3 элементов

        // Корректируем индексы, чтобы они были в диапазоне 0-2
        const posIndex = item.positiveLocation - 1; // Уменьшаем на 1
        const negIndex = item.negativeLocation - 1; // Уменьшаем на 1

        // Проверяем, что индекс в допустимых пределах (0, 1, 2)
        if (posIndex >= 0 && posIndex < 3) {
          row[posIndex] = 'חיובי'; // Или "X", если ты хочешь оставить символы
        }
        if (negIndex >= 0 && negIndex < 3) {
          row[negIndex] = 'שלילי'; // Или "O"
        }

        row = row.map((value) => (value === '' ? 'ביקורת' : value));

        return row;
      });

      console.log('Преобразованные данные:', transformedData);
      setSelectedValues(transformedData);
    } catch (error) {
      console.error('Ошибка при получении случайных значений:', error);
    }
  };

  const handleSubmit = async () => {
    console.log('sessionId перед отправкой:', sessionId);
    console.log('trials перед отправкой:', trials);

    const trainingData = selectedValues.map((trial, index) => ({
      id: 0, // Временно 0, пока сервер не вернёт ID
      sendNumber: Math.min(index + 1, trials), // Ограничение по количеству отправок
      positiveLocation: trial.includes('חיובי')
        ? 2 - trial.indexOf('חיובי') + 1
        : 0,
      negativeLocation: trial.includes('שלילי')
        ? 2 - trial.indexOf('שלילי') + 1
        : 0,
      sessionId: sessionId || 0,
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
      navigate('/trials', { state: { trainingData } });
    } catch (error) {
      console.error('Ошибка при запросе:', error);
      alert(error.message);
    }
  };
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
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.selectWrapper}>
                  <select
                    className={styles.item}
                    value={selectedValues[index][2 - i]}
                    onChange={(event) => handleChange(index, i, event)}
                    style={{
                      backgroundColor:
                        backgroundColors[selectedValues[index][2 - i]] ||
                        '#00000014',
                    }}
                  >
                    <option value="" disabled></option>
                    {arrX.reverse().map((value) => (
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
          <button
            className={styles.button}
            onClick={() => fillRandomly(sessionId)}
          >
            מילוי רנדומלי
          </button>
        </div>
        <NavBar />
      </div>
    </div>
  );
}

export default TrainingPlan;
