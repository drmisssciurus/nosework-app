import { useState } from 'react';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';

import styles from './TrainingPlan.module.css';

function TrainingPlan({ trials }) {
  console.log(trials);
  const arrX = ['חיובי', 'ביקורת', 'שלילי'];
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

  return (
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
                      backgroundColors[selectedValues[index][i]] || 'white',
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
      <div>
        <button className={styles.button}>המשך</button>
        <button className={styles.button}>מילוי רנדומלי</button>
      </div>
      <NavBar />
    </div>
  );
}

export default TrainingPlan;
