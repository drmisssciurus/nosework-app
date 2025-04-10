import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import styles from './SessionTrainProgOverw.module.css';

import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import Button from '../../components/Button/Button';

function SessionTrainProgOverw() {
  const { sessionId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const indexFromTop = Number(searchParams.get('index'));
  const totalSessions = Number(searchParams.get('total'));
  const sessionNumber = totalSessions - indexFromTop;
  const [trainingProgram, setTrainingProgram] = useState([]);
  const [trials, setTrials] = useState([]);
  const [containerType, setContainerType] = useState();
  const [dogName, setDogName] = useState('');

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const sessionResponse = await fetch(`/api/Session/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!sessionResponse.ok) throw new Error('Ошибка загрузки сессии');

        const sessionData = await sessionResponse.json();
        setContainerType(sessionData.containerType);

        const dogResponse = await fetch(`/api/Dog/${sessionData.dogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (dogResponse.ok) {
          const dogData = await dogResponse.json();
          setDogName(dogData.name);
        }

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
    await new Promise((resolve) => setTimeout(resolve, 500)); // Ждем рендеринг DOM

    const element = document.getElementById('pdf-content');
    if (!element) {
      console.error('Ошибка: Элемент pdf-content не найден');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Высокое качество
        useCORS: true,
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Ширина PDF
      const pageHeight = 277; // Высота одной страницы PDF

      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Рассчитываем высоту изображения

      let heightLeft = imgHeight;
      let position = 0;
      let currentPage = 1;

      while (heightLeft >= 0) {
        const startY =
          (currentPage - 1) * pageHeight * (canvas.width / imgWidth); // Рассчитываем начальную позицию Y для обрезки

        const canvasPage = document.createElement('canvas');
        canvasPage.width = canvas.width;
        canvasPage.height = Math.min(
          pageHeight * (canvas.width / imgWidth),
          canvas.height - startY
        );

        const ctx = canvasPage.getContext('2d');
        ctx.drawImage(
          canvas,
          0,
          startY, // Начальная позиция X и Y для обрезки из исходного canvas
          canvas.width,
          canvasPage.height, // Ширина и высота для обрезки
          0,
          0, // Позиция X и Y для вставки в новый canvas
          canvasPage.width,
          canvasPage.height // Ширина и высота для вставки
        );

        const imgData = canvasPage.toDataURL('image/png');

        if (currentPage > 1) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          'PNG',
          10,
          0,
          imgWidth,
          canvasPage.height / (canvas.width / imgWidth)
        ); // Корректная высота изображения на странице
        heightLeft -= pageHeight;
        currentPage++;
      }

      pdf.save(`Session_${sessionNumber}_Dog_${dogName}.pdf`);
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
    }
  };

  return (
    <div className="container">
      <Header>
        תוכנית אימון {dogName}, אימון {sessionNumber}
      </Header>
      <div id="pdf-content" className={styles.content}>
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
