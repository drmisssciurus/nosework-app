import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './TrainingPlan.module.css';

import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import Button from '../../components/Button/Button';

function TrainingPlan() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    sessionId,
    containerType,
    trials,
    date,
    dogId,
    trainer,
    trialX,
    finalResults,
    dPrimeScore,
  } = location.state || {};

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
  const [currentSessionId, setCurrentSessionId] = useState(sessionId || 0);

  const handleChange = (trialIndex, selectIndex, event) => {
    const newValues = [...selectedValues];
    newValues[trialIndex][selectIndex] = event.target.value;
    setSelectedValues(newValues);
  };

  const sessionCreatedRef = useRef(false);

  //session post
  const handleSessionSubmit = useCallback(async () => {
    if (sessionCreatedRef.current) return;

    sessionCreatedRef.current = true;

    if (currentSessionId !== 0) return;
    const userId = localStorage.getItem('userId');
    const sessionData = {
      id: 0,
      dogId,
      trainer,
      date: new Date(date).toISOString(),
      numberOfTrials: trials,
      containerType,
      trialX,
      finalResults,
      dPrimeScore,
      userId: userId,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Error: Missing authorization token');
      }

      const response = await fetch(
        `/api/Session?userId=${encodeURIComponent(userId)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sessionData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error creating session: ${response.status}`);
      }

      const responseData = await response.json();

      setCurrentSessionId(responseData.id);
      localStorage.setItem('sessionId', responseData.id);

      console.log(
        '📤 Отправляемые данные на сервер:',
        JSON.stringify(sessionData, null, 2)
      );
      console.log('✅ userId из localStorage:', userId);
      console.log('🟢 Используемый sessionId:', currentSessionId);

      return responseData.id;
    } catch (error) {
      console.error('Error creating session:', error);
      alert(error.message);
      sessionCreatedRef.current = false;
      return null;
    }
  }, [
    currentSessionId,
    date,
    dogId,
    trainer,
    trials,
    containerType,
    trialX,
    finalResults,
    dPrimeScore,
  ]);

  useEffect(() => {
    const createSession = async () => {
      const savedSessionId = localStorage.getItem('sessionId');

      if (savedSessionId && savedSessionId !== '0') {
        setCurrentSessionId(Number(savedSessionId));
      } else {
        await handleSessionSubmit();
      }
    };

    createSession();
  }, []);

  const fillRandomly = async () => {
    if (!currentSessionId || currentSessionId === 0) {
      console.error('Error: sessionId is missing, generation is not possible.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Error: Missing authorization token');
        return;
      }

      const response = await fetch(
        `/api/TrainingProgram/Random/${currentSessionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error loading data: ${response.statusText}`);
      }

      const data = await response.json();

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

      setSelectedValues(transformedData);
    } catch (error) {
      console.error('Error getting random values:', error);
    }
  };

  const handleSubmit = async () => {
    const newSessionId = currentSessionId;
    if (!newSessionId || newSessionId === 0) {
      console.error('Error: sessionId not received, aborting execution.');
      return;
    }

    const trainingData = selectedValues.map((trial, index) => {
      const mappedIndexes = { 0: 1, 1: 2, 2: 3 };

      return {
        id: 0,
        trialNumber: index + 1,
        positiveLocation: trial.includes('חיובי')
          ? mappedIndexes[trial.indexOf('חיובי')]
          : 0,
        negativeLocation: trial.includes('שלילי')
          ? mappedIndexes[trial.indexOf('שלילי')]
          : 0,
        sessionId: newSessionId,
      };
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Error: Missing authorization token');
      }

      const response = await fetch('/api/TrainingProgram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trainingData),
      });

      if (!response.ok) {
        throw new Error(`Error sending TrainingProgram: ${response.status}`);
      }

      navigate('/trials', { state: { trainingData } });
    } catch (error) {
      console.error('Error sending TrainingProgram:', error);
      alert(error.message);
    }
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem('sessionId');
    };
  }, []);

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
                const reversedIndex = arr.length - 1 - i;

                return (
                  <div key={reversedIndex} className={styles.selectWrapper}>
                    <select
                      className={styles.item}
                      value={selectedValues[index][reversedIndex]}
                      onChange={(event) =>
                        handleChange(index, reversedIndex, event)
                      }
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
          <Button
            className={styles.btnStart}
            onClick={handleSubmit}
            disabled={
              selectedValues.some((row) =>
                row.every((value) => value === '')
              ) || currentSessionId === 0
            }
          >
            המשך
          </Button>

          <Button
            className={styles.btnRandom}
            onClick={() => fillRandomly()}
            disabled={currentSessionId === 0}
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
