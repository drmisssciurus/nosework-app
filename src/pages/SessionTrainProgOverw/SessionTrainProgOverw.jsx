import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import Button from '../../components/Button/Button';
import styles from './SessionTrainProgOverw.module.css';
import html2canvas from 'html2canvas';
import Icons from '../../components/Icons';

function SessionTrainProgOverw() {
  const { sessionId } = useParams();
  const [trainingProgram, setTrainingProgram] = useState([]);
  const [trials, setTrials] = useState([]);
  const [containerType, setContainerType] = useState();
  const [dogName, setDogName] = useState('');

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Получаем данные о сессии, чтобы определить тип контейнеров и имя собаки
        const sessionResponse = await fetch(`/api/Session/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!sessionResponse.ok) throw new Error('Ошибка загрузки сессии');

        const sessionData = await sessionResponse.json();
        setContainerType(sessionData.containerType);

        // Получаем имя собаки
        const dogResponse = await fetch(`/api/Dog/${sessionData.dogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (dogResponse.ok) {
          const dogData = await dogResponse.json();
          setDogName(dogData.name);
        }

        // Получаем данные о тренировке
        const trainingResponse = await fetch(
          `/api/TrainingProgram/BySession/${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const trialsResponse = await fetch(
          `/api/Trial/bySession/${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!trainingResponse.ok || !trialsResponse.ok) {
          throw new Error('Ошибка загрузки данных');
        }

        const trainingData = await trainingResponse.json();
        const trialsData = await trialsResponse.json();

        setTrainingProgram(trainingData);
        setTrials(trialsData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    }

    fetchData();
  }, [sessionId]);

  const downloadPDF = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Даем время DOM отрендериться

    const element = document.getElementById('pdf-content');
    if (!element) {
      console.error('Ошибка: Элемент pdf-content не найден');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 3, // Повышаем качество рендеринга
        backgroundColor: null, // Убираем белые рамки
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 190;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save(`Session_${sessionId}_Training_Program.pdf`);
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
    }
  };

  return (
    <div className="container">
      <div id="pdf-content" className={styles.content}>
        <Header>
          תוכנית אימון {dogName}, אימון {sessionId}
        </Header>
        <div className={styles.targetContainers}>
          <p className={styles.target}>סניפר 3</p>
          <p className={styles.target}>סניפר 2</p>
          <p className={styles.target}>סניפר 1</p>
        </div>
        <div className={styles.trialsContainer}>
          {trainingProgram.map((trial, index) => {
            const selected =
              trials.find((t) => t.trainingId === trial.id)?.selectedLocation ||
              null;

            // Распределение контейнеров справа налево
            const containers = ['ביקורת', 'ביקורת', 'ביקורת'];
            if (trial.positiveLocation > 0) {
              containers[3 - trial.positiveLocation] = 'positive';
            }

            if (trial.negativeLocation > 0) {
              containers[3 - trial.negativeLocation] = 'negative';
            }

            return (
              <div key={index} className={styles.trialRow}>
                <div className={styles.containers}>
                  {containers
                    .filter((_, i) => i < 3)
                    .map((type, i) => (
                      <div
                        key={i}
                        className={`${styles.item} ${
                          type === 'positive' ? styles.positive : ''
                        } ${type === 'negative' ? styles.negative : ''} ${
                          selected === 3 - i ? styles.selected : ''
                        }`}
                      >
                        {type === 'positive' ? 'חיובי' : ''}
                        {type === 'negative' ? 'שלילי' : ''}
                        {type === 'ביקורת' ? 'ביקורת' : ''}
                      </div>
                    ))}
                </div>
                <p className={styles.containersNumber}>{index + 1}</p>
              </div>
            );
          })}
        </div>
        <div className={styles.description}>בחירת טאץ מודגשת עם קו תחתון</div>
      </div>
      <Button onClick={downloadPDF} className={styles.btnPDF}>
        ייצא כקובץ PDF
      </Button>
      <NavBar />
    </div>
  );
}

export default SessionTrainProgOverw;
