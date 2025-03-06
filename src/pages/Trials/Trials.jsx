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
  const [uploadedVideoName, setUploadedVideoName] = useState('');
  const [dogName, setDogName] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalBackground, setModalBackground] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const currentTrial =
    trainingData.length > 0 ? trainingData[currentTrialIndex] : null;

  console.log('currentTrial: ', currentTrial);
  console.log('currentTrialIndex: ', currentTrialIndex);

  const trainingId =
    location.state?.trainingId ||
    location.state?.trainingData?.[0]?.sessionId ||
    null;

  console.log('trainingId: ', trainingId);

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
    return () => {
      localStorage.removeItem('currentTrialIndex');
    };
  }, []);

  useEffect(() => {
    const savedIndex = localStorage.getItem('currentTrialIndex');
    console.log('сохраненный индекс в юзэффект: ', savedIndex);
    if (savedIndex !== null) {
      setCurrentTrialIndex(Number(savedIndex)); // Восстанавливаем индекс
    }
  }, []);

  useEffect(() => {
    async function fetchDogName() {
      if (!trainingId) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        console.log('Запрашиваем имя собаки...');
        const sessionResponse = await fetch(`/api/Session/${trainingId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!sessionResponse.ok)
          throw new Error(`Session fetch error: ${sessionResponse.statusText}`);

        const sessionData = await sessionResponse.json();
        if (!sessionData.dogId) return;
        const dogResponse = await fetch(`/api/Dog/${sessionData.dogId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!dogResponse.ok)
          throw new Error(`Dog fetch error: ${dogResponse.statusText}`);

        const dogData = await dogResponse.json();
        setDogName(dogData.name);
      } catch (error) {
        console.error('Ошибка при получении имени собаки:', error);
      }
    }

    fetchDogName();
  }, [trainingId]);

  useEffect(() => {
    async function fetchTrainingData() {
      if (!trainingId) return;
      const token = localStorage.getItem('token');
      if (!token) return;

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

        console.log('fetchTrainingData response: ', response);

        if (!response.ok)
          throw new Error(`Fetching error: ${response.statusText}`);
        const data = await response.json();
        setTrainingData(data);
      } catch (error) {
        console.error('Error fetching training data: ', error);
      }
    }
    fetchTrainingData();
  }, [trainingId]);

  function handleUploadVideo(videoFile) {
    setUploadedVideo(videoFile);
    setUploadedVideoName(videoFile.name);
  }

  async function handleVideoSubmit() {
    if (!uploadedVideo || !currentTrial || !currentTrial.id) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData();
    formData.append('file', uploadedVideo, uploadedVideo.name || 'video.mp4');

    console.log('handleVideoSubmit formData: ', formData);
    console.log('handleVideoSubmit currentTrial: ', currentTrial);

    try {
      const response = await fetch(
        `/api/Trial/uploadVideo/${currentTrial.sessionId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log(' handleVideoSubmit Server response:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error loading video:', errorText);
        throw new Error(`Error loading video: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Видео успешно загружено:', responseData);

      return responseData.videoUrl;
    } catch (error) {
      console.error('Error loading video:', error);
    }
  }

  function closeModal() {
    setModalOpen(false);
    if (currentTrialIndex < trainingData.length - 1) {
      const nextIndex = currentTrialIndex + 1;
      setCurrentTrialIndex((prevIndex) => prevIndex + 1);
      localStorage.setItem('currentTrialIndex', nextIndex);
      setUploadedVideoName('');
    } else {
      navigate('/end_session');
    }
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

    let videoUrl = 'string';

    if (uploadedVideo) {
      videoUrl = await handleVideoSubmit();
      if (!videoUrl) {
        console.error('Error loading video, sending cancelled');
      }
    }

    const payload = {
      id: 0,
      trainingId: currentTrial.id,
      selectedLocation,
      targetScent: targetScent.trim() === '' ? '' : targetScent,
      result: 'completed',
      videoUrl,
    };

    //delete
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

      console.log('Data sent:', payload);

      const responseData = await response.json();

      const resultMessages = {
        H: '✅ כל הכבוד',
        M: '❌ לא נורא, פעם הבאה',
        FA: '❌ לא נורא, פעם הבאה',
        CR: '✅ כל הכבוד',
      };

      const resultColors = {
        H: '#22c55e',
        M: '#ff9500',
        FA: '#ff3b30',
        CR: '#ff4',
      };

      if (responseData.result in resultMessages) {
        setModalMessage(resultMessages[responseData.result] || '');
        setModalBackground(resultColors[responseData.result] || '');
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="container">
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <h1 className={styles.trialNumber}>
            {`שליחה #(${currentTrialIndex + 1}/${trainingData.length})`}
          </h1>

          {/* <h1 className={styles.trialNumber}>{`${dogName} :כלב`}</h1> */}
          <h1 className={styles.trialNumber}>
            {dogName ? `${dogName} :כלב` : 'טוען...'}
          </h1>
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
            {uploadedVideoName ? (
              <p
                className={styles.videoFileName}
              >{` ${uploadedVideoName} :נבחר קובץ`}</p>
            ) : (
              <button
                className={styles.btnVideo}
                onClick={() => setIsModalOpen(true)}
              >
                העלאה
              </button>
            )}
            {/* <Link
              to={
                currentTrial
                  ? `/video_recording?id=${currentTrial.id}&index=${currentIndex}`
                  : '#'
              }
              className={styles.btnVideo}
              onClick={(e) => {
                if (!currentTrial) {
                  e.preventDefault();
                  console.error(
                    'Error: currentTrial is null, cannot navigate to video recording.'
                  );
                }
              }}
            >
              הקלטה
            </Link> */}
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
