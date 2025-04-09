import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

import styles from './ContinueTrials.module.css';

import Footer from '../../components/Footer/Footer';
import VideoUpload from '../../components/VideoUpload/VideoUpload';
import Button from '../../components/Button/Button';

Modal.setAppElement('#root');

function ContinueTrials() {
  const location = useLocation();
  const navigate = useNavigate();

  const [trialData, setTrialData] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [targetScent, setTargetScent] = useState('');
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [uploadedVideoName, setUploadedVideoName] = useState('');
  const [dogName, setDogName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalBackground, setModalBackground] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentTrialIndex, setCurrentTrialIndex] = useState(
    location.state?.nextTrialNumber ? location.state.nextTrialNumber - 1 : 0
  );
  const trainingId = location.state?.sessionId || null;

  const currentTrial = trainingData[currentTrialIndex] || {};
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

  // useEffect(() => {
  //   return () => {
  //     localStorage.removeItem('currentTrialIndex');
  //   };
  // }, []);

  useEffect(() => {
    const savedIndex = localStorage.getItem('currentTrialIndex');
    if (savedIndex !== null) {
      setCurrentTrialIndex(Number(savedIndex));
    }
  }, []);

  useEffect(() => {
    async function fetchDogName() {
      if (!trainingId) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
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
        console.error('Error getting dog name:', error);
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

  useEffect(() => {
    async function fetchTrials() {
      if (!trainingId || trainingData.length === 0) {
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`/api/Trial`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok)
          throw new Error(`Fetching error: ${response.statusText}`);

        const trials = await response.json();
        const matchedTrials = trainingData.map((trial, index) => {
          const matchedTrial = trials.find(
            (t) => t.trainingId === trainingId && t.trialNumber === index + 1
          );
          return matchedTrial ? { ...trial, id: matchedTrial.id } : trial;
        });

        setTrialData(matchedTrials);
      } catch (error) {
        console.error('Error fetching trials:', error);
      }
    }
    fetchTrials();
  }, [trainingId, trainingData]);

  function handleUploadVideo(videoFile) {
    setUploadedVideo(videoFile);
    setUploadedVideoName(videoFile.name);
  }

  async function handleVideoSubmit(trialId) {
    if (!uploadedVideo) {
      console.error('Error: No uploaded video');
      return;
    }

    if (!trialId) {
      console.error('Error: No valid trialId for video upload');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const fileName = uploadedVideo.name;

    try {
      const presignedUrlResponse = await fetch(
        `/api/Trial/getPresignedUrl/${trialId}?fileName=${encodeURIComponent(
          fileName
        )}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('presignedUrlResponse:', presignedUrlResponse);

      if (!presignedUrlResponse.ok) {
        const errorText = await presignedUrlResponse.text();
        console.error('Error getting presigned URL:', errorText);
        return;
      }

      const { url: presignedUrl } = await presignedUrlResponse.json();

      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': uploadedVideo.type,
        },
        body: uploadedVideo,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Error uploading video to presigned URL:', errorText);
        return;
      }

      console.log(
        '[DONE] Video upload completed for TrialId:',
        trialId,
        new Date().toISOString()
      );

      const videoUrl = presignedUrl.split('?')[0];
      console.log('VideoUrl:', videoUrl);
      const updateTrialResponse = await fetch(
        `/api/Trial/updateVideoUrl/${trialId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(videoUrl),
        }
      );
      if (!updateTrialResponse.ok) {
        console.error('Error updating video URL in Trial');
      }
    } catch (error) {
      console.error('Error loading video:', error);
    }
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedLocation(0);
    setUploadedVideoName('');
    setUploadedVideo(null);

    if (currentTrialIndex < trainingData.length - 1) {
      const nextIndex = currentTrialIndex + 1;
      setCurrentTrialIndex((prevIndex) => prevIndex + 1);
      localStorage.setItem('currentTrialIndex', nextIndex);
    } else {
      localStorage.removeItem('currentTrialIndex');
      navigate('/end_session', {
        state: { trainingId },
      });
    }
  }

  function openResultModal(result) {
    const resultMessages = {
      H: '✅ כל הכבוד',
      M: '❌ לא נורא, פעם הבאה',
      FA: '❌ לא נורא, פעם הבאה',
      CR: '✅ כל הכבוד',
    };

    const resultColors = {
      H: '#22c55e',
      M: '#ff3b30',
      FA: '#ff3b30',
      CR: '#22c55e',
    };

    if (result in resultMessages) {
      setModalMessage(resultMessages[result] || '');
      setModalBackground(resultColors[result] || '');
      setModalOpen(true);
    }
  }

  async function handleSubmit() {
    if (!trainingData.length) {
      console.error('Error: No training data available');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: There is no token');
      return;
    }

    setIsLoading(true);

    let videoUrl = 'string';

    const payload = {
      id: 0,
      trainingId: currentTrial.id,
      selectedLocation,
      targetScent: targetScent.trim() || '',
      result: 'completed',
      videoUrl,
    };

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
        const errorText = await response.text();
        console.error(
          `Error sending trial data: ${response.status} ${errorText}`
        );
        throw new Error(`Error sending data: ${response.statusText}`);
      }

      const responseData = await response.json();

      const newTrialId = responseData.id;

      openResultModal(responseData.result);

      if (uploadedVideo && newTrialId) {
        console.log(`[BACKGROUND] Uploading video for trialId ${newTrialId}`);
        handleVideoSubmit(newTrialId);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <h1 className={styles.trialNumber}>
            {`שליחה #(${currentTrialIndex + 1}/${trainingData.length})`}
          </h1>
          <h1 className={styles.trialNumber}>
            {dogName ? `${dogName} :כלב` : 'טוען...'}
          </h1>
        </header>
        <div className={styles.containers}>
          {trainingData &&
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
                  <p className={styles.contentName}>
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
          <h2 className={styles.videoTitle}>
            {uploadedVideo ? 'הסרטון הועלה בהצלחה' : 'העלאה או הקלטה של סרטון'}
          </h2>
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
        <p className={styles.modalTitle}>{modalMessage}</p>
        <Button onClick={closeModal}>
          {currentTrialIndex < trainingData.length - 1
            ? 'שליחה הבאה'
            : 'סיים אימון'}
        </Button>
      </Modal>

      {isLoading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loader}></div>
        </div>
      )}
    </div>
  );
}

export default ContinueTrials;
