import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import styles from './Trials.module.css';
import { useEffect, useState } from 'react';
import VideoUpload from '../../components/VideoUpload/VideoUpload';
import Modal from 'react-modal';
import Button from '../../components/Button/Button';

Modal.setAppElement('#root');

function Trials() {
  const location = useLocation();
  const navigate = useNavigate();

  const [trainingData, setTrainingData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [targetScent, setTargetScent] = useState('');
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(
    parseInt(localStorage.getItem('currentIndex')) || 0
  );
  const [dogName, setDogName] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLastTrial, setIsLastTrial] = useState(false);
  const [modalBackground, setModalBackground] = useState('');

  console.log('uploadedVideo:', uploadedVideo);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const trainingId =
    location.state?.trainingId ||
    location.state?.trainingData?.[0]?.sessionId ||
    null;

  //delete
  console.log('ID from training plan', trainingId);

  const containersColors = {
    positive: '#22c55e',
    negative: '#ff3b30',
    empty: '#ff9500',
  };

  const choicesMapping = {
    'סניפר 1': 1,
    'סניפר 2': 2,
    'סניפר 3': 3,
    'אין בחירה': 0,
  };

  useEffect(() => {
    async function fetchDogName() {
      if (!trainingId) return;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('There in no token');
        return;
      }

      try {
        const sessionResponse = await fetch(`/api/Session/${trainingId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!sessionResponse.ok) {
          throw new Error(
            `Fetching session error: ${sessionResponse.statusText}`
          );
        }

        const sessionData = await sessionResponse.json();
        const dogId = sessionData.dogId;

        const dogResponse = await fetch(`/api/Dog/${dogId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!dogResponse.ok) {
          throw new Error(`Fetching dog error: ${dogResponse.statusText}`);
        }

        const dogData = await dogResponse.json();
        setDogName(dogData.name);
      } catch (error) {
        console.error('Error fetching dog name: ', error);
      }
    }
    fetchDogName();
  }, [trainingId]);

  console.log('dog name:', dogName);

  useEffect(() => {
    async function fetchTrainingData() {
      if (!trainingId) return;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('There in no token');
        return;
      }

      try {
        const response = await fetch(
          `/api/TrainingProgram/BySession/${trainingId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Fetching error: ${response.statusText}`);
        }
        const data = await response.json();
        setTrainingData(data);
        const savedIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
        setCurrentIndex(savedIndex < data.length ? savedIndex : 0);
      } catch (error) {
        console.error('Error fetching training data: ', error);
      }
    }
    fetchTrainingData();
  }, [trainingId]);

  useEffect(() => {
    if (currentIndex >= trainingData.length) {
      console.warn(
        'currentIndex вышел за границы trainingData, сбрасываем в 0'
      );
      setCurrentIndex(0);
      localStorage.setItem('currentIndex', 0);
    }
  }, [currentIndex, trainingData]);

  const currentTrial = trainingData[currentIndex] || null;

  function handleUploadVideo(videoFile) {
    setUploadedVideo(videoFile);
  }

  async function handleVideoSubmit() {
    if (!uploadedVideo) {
      console.error('Error: No video file selected!');
      return;
    }

    if (!trainingId) {
      console.error('Error: No valid trainingId available!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: No authentication token found!');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedVideo, uploadedVideo.name || 'video.mp4'); // Указываем имя файла

    const uploadUrl = `/api/VideoUpload/${trainingId}`;
    console.log('Uploading video to:', uploadUrl);
    console.log('Using trainingId:', trainingId);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // НЕ указываем Content-Type (он устанавливается автоматически для FormData)
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response Headers:', response.headers);
        throw new Error(`Video upload failed: ${response.status} ${errorText}`);
      }

      console.log('Video successfully uploaded');
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  }

  function closeModal() {
    console.log('Закрываем модальное окно с результатом');
    setModalOpen(false);

    setTimeout(() => {
      if (isLastTrial) {
        console.log('Последний трайл, готовимся к переходу...');
        localStorage.removeItem('currentIndex');
        navigate('/end_session');
      } else {
        const updatedIndex = currentIndex + 1;
        console.log(`Обновляем currentIndex: ${updatedIndex}`);
        setCurrentIndex(updatedIndex);
        localStorage.setItem('currentIndex', updatedIndex);
      }
    }, 300);
  }

  async function handleSubmit() {
    if (!currentTrial) {
      console.error('Error: there is no trial!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: There is no token');
      return;
    }

    const payload = {
      id: 0,
      trainingId: currentTrial.id,
      selectedLocation,
      targetScent: targetScent.trim() === '' ? '' : targetScent,
      result: 'completed',
    };

    console.log('Отправляемые данные:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch('/api/Trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Sending error: ${response.statusText}`);
      }

      console.log('Data send: ', payload);

      const responseData = await response.json();
      console.log('responseData:', responseData);

      const resultMessages = {
        H: '✅ Dog HIT!',
        M: '❌ Dog Miss :(',
        FA: '⚠️ Dog Fail :(',
        CR: 'Dog Dog Dog!',
      };

      const resultColors = {
        H: '#22c55e', // Зеленый - HIT
        M: '#ff9500', // Красный - MISS
        FA: '#ff3b30',
        CR: '#ff4',
      };

      if (responseData.result in resultMessages) {
        setModalMessage(resultMessages[responseData.result] || '');
        setModalBackground(resultColors[responseData.result] || '');
        setModalOpen(true);
        setIsLastTrial(currentIndex + 1 >= trainingData.length);
      }

      if (uploadedVideo) {
        await handleVideoSubmit();
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  useEffect(() => {
    if (!modalOpen && isLastTrial) {
      console.log('Модалка с результатом закрыта, переходим на /end_session');
      navigate('/end_session');
    }
  }, [modalOpen, isLastTrial, navigate]);

  return (
    <div className="container">
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <h1 className={styles.trialNumber}>
            {`שליחה #(${trainingData.length})${
              currentTrial ? currentTrial.trialNumber : '?'
            }`}
          </h1>

          <h1 className={styles.trialNumber}>{`${dogName} :כלב`}</h1>
        </header>
        <div className={styles.containers}>
          {currentTrial &&
            [3, 2, 1].map((containerIndex) => {
              let color = containersColors.empty;
              if (currentTrial.positiveLocation === containerIndex)
                color = containersColors.positive;
              if (currentTrial.negativeLocation === containerIndex)
                color = containersColors.negative;

              return (
                <div
                  key={containerIndex}
                  className={styles.container}
                  style={{ color }}
                >
                  <p className={styles.boxName}>{`סניפר ${containerIndex}`}</p>
                  <p>
                    {currentTrial.positiveLocation === containerIndex
                      ? 'חיובי'
                      : currentTrial.negativeLocation === containerIndex
                      ? 'שלילי'
                      : 'ביקורת'}
                  </p>
                </div>
              );
            })}
        </div>

        <div className={styles.videoContainer}>
          <h2 className={styles.videoTitle}>העלאה או הקלטה של סרטון</h2>
          <div className={styles.btnContainer}>
            <button
              className={styles.btnVideo}
              onClick={() => setIsModalOpen(true)}
            >
              העלאה
            </button>

            <Link to="/video_recording" className={styles.btnVideo}>
              הקלטה
            </Link>
          </div>
        </div>
        <div className={styles.wrapper}>
          <label className={styles.inputLabel} htmlFor="">
            סוג ריח מטרה
          </label>
          <input
            className={styles.input}
            type="text"
            id="targetScent"
            placeholder="שם הריח פה"
            value={targetScent}
            onChange={(e) => setTargetScent(e.target.value)}
          />
        </div>
        <div className={styles.checkboxes}>
          <p className={styles.checkbLabel}>הסימון הסופי</p>
          <div className={styles.checkbWrapper}>
            {Object.entries(choicesMapping).map(([name, value]) => (
              <div className={styles.item} key={value}>
                <p className={styles.itemName}>{name}</p>
                <input
                  type="radio"
                  name="finalChoice"
                  value={value}
                  checked={selectedLocation === value}
                  onChange={() => {
                    setSelectedLocation(value);
                    console.log('Selected choice:', value);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.btnContainer}>
          <Button className={styles.btn} onClick={handleSubmit}>
            שליחה הבאה
          </Button>
          <Button className={styles.btn} onClick={() => navigate('/mainpage')}>
            חזרה למסך הבית
          </Button>
        </div>
      </div>
      <Footer />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <VideoUpload
          closeModal={() => setIsModalOpen(false)}
          onUpload={handleUploadVideo}
        />
      </Modal>
      <Modal
        className={styles.modal}
        style={{ content: { backgroundColor: modalBackground } }}
        isOpen={modalOpen}
        onRequestClose={closeModal}
      >
        <h2>{modalMessage}</h2>
        <Button onClick={closeModal}>ОК</Button>
      </Modal>
    </div>
  );
}

export default Trials;
