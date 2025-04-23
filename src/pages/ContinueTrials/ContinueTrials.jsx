import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

import styles from './ContinueTrials.module.css';

import Footer from '../../components/Footer/Footer';
import VideoUpload from '../../components/VideoUpload/VideoUpload';
import Button from '../../components/Button/Button';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

Modal.setAppElement('#root');

function ContinueTrials() {
  const location = useLocation(); // Read passed state (sessionId, nextTrialNumber)
  const navigate = useNavigate(); // Programmatic navigation

  // State variables
  const [trialData, setTrialData] = useState([]); // Holds trials with IDs to continue
  const [trainingData, setTrainingData] = useState([]); // Original training plan data
  const [selectedLocation, setSelectedLocation] = useState(0); // User's final container selection
  const [targetScent, setTargetScent] = useState(''); // Optional scent name input
  const [uploadedVideo, setUploadedVideo] = useState(null); // File object for video to upload
  const [uploadedVideoName, setUploadedVideoName] = useState(''); // Filename for UI
  const [dogName, setDogName] = useState(''); // Name of the dog in this session
  const [isLoading, setIsLoading] = useState(false); // Loading indicator for submissions
  const [modalOpen, setModalOpen] = useState(false); // Result feedback modal
  const [modalMessage, setModalMessage] = useState(''); // Message shown in result modal
  const [modalBackground, setModalBackground] = useState(''); // Background color for result modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Video upload modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Confirmation before leaving

  // Determine starting index (zero‑based) from passed nextTrialNumber
  const [currentTrialIndex, setCurrentTrialIndex] = useState(
    location.state?.nextTrialNumber ? location.state.nextTrialNumber - 1 : 0
  );
  const trainingId = location.state?.sessionId || null; // Session ID for API calls

  const currentTrial = trainingData[currentTrialIndex] || {}; // Data for the active trial
  // Colors for container display based on positive/negative/empty
  const containersColors = {
    positive: '#22c55e',
    negative: '#ff3b30',
    empty: '#ff9500',
  };
  // Mapping of Hebrew labels to numeric codes
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

  // Load saved trial index from localStorage, if any
  useEffect(() => {
    const savedIndex = localStorage.getItem('currentTrialIndex');
    if (savedIndex !== null) {
      setCurrentTrialIndex(Number(savedIndex));
    }
  }, []);

  // Fetch dog name for display in header
  useEffect(() => {
    async function fetchDogName() {
      if (!trainingId) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Get session details to retrieve dogId
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

        // Fetch dog profile
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

  // Fetch training plan for this session
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

  // Fetch existing trials to know which ones are done (to set IDs for continuation)
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

        // Match training plan entries with any existing trial records
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

  // Handle file selected in VideoUpload component
  function handleUploadVideo(videoFile) {
    setUploadedVideo(videoFile);
    setUploadedVideoName(videoFile.name);
  }

  // Upload video file to S3 via presigned URL and update trial record
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
      // Request presigned URL
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

      // Upload file directly to S3
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

      // Extract final URL (without query params)
      const videoUrl = presignedUrl.split('?')[0];
      console.log('VideoUrl:', videoUrl);

      // Update trial record with video URL
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

  // Close feedback modal and advance to next trial or end session
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

  // Show result message modal with custom text/color based on trial outcome
  function openResultModal(result) {
    const resultMessages = {
      H: '✅ כל הכבוד',
      M: '⚠️ לא נורא, פעם הבאה',
      FA: '⚠️ לא נורא, פעם הבאה',
      CR: '✅ כל הכבוד',
    };

    const resultColors = {
      H: '#22c55e',
      M: '#42a4f5',
      FA: '#42a4f5',
      CR: '#22c55e',
    };

    if (result in resultMessages) {
      setModalMessage(resultMessages[result] || '');
      setModalBackground(resultColors[result] || '');
      setModalOpen(true);
    }
  }

  // Submit trial data, open feedback modal, and trigger video upload if needed
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

        {/* Container display for positive/negative/empty */}
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

        {/* Video upload section */}
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

        {/* Target scent input */}
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

        {/* Final choice radio buttons */}
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

        {/* Action buttons */}
        <div className={styles.btnContainer}>
          <Button className={styles.btn} onClick={handleSubmit}>
            שליחה הבאה
          </Button>
          <Button className={styles.btn} onClick={() => setIsConfirmOpen(true)}>
            חזרה למסך הבית
          </Button>
        </div>
      </div>
      <Footer />

      {/* Video upload modal */}
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

      {/* Result feedback modal */}
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

      {/* Confirmation before leaving session */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onConfirm={() => {
          localStorage.removeItem('currentTrialIndex');
          navigate('/mainpage');
        }}
        onCancel={() => setIsConfirmOpen(false)}
        message="האם אתה בטוח שברצונך לצאת מהאימון הנוכחי? תוכל לחזור לשליחה זו שוב בהמשך ממסך הבית"
      />

      {/* Loading overlay while submitting */}
      {isLoading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loader}></div>
        </div>
      )}
    </div>
  );
}

export default ContinueTrials;
