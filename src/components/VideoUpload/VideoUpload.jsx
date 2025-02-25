import { useState } from 'react';
import styles from './VideoUpload.module.css';
import arrowBack from '../../assets/icons/icon-arrow-left.svg';

function VideoUpload({ closeModal, onUpload }) {
  const [videoFile, setVideoFile] = useState(null);

  function handleFileChange(e) {
    setVideoFile(e.target.files[0]);
  }

  function handleUpload() {
    if (videoFile) {
      onUpload(videoFile);
      closeModal();
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.titleWrapper}>
        <button className={styles.btnClose} onClick={closeModal}>
          <img src={arrowBack} alt="Back" />
        </button>
        <h2 className={styles.title}>העלאת וידאו</h2>
      </div>
      <div className={styles.modalContent}>
        <input
          className={styles.input}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
        />
        <button
          className={styles.btnUpload}
          onClick={handleUpload}
          disabled={!videoFile}
        >
          העלאה
        </button>
      </div>
    </div>
  );
}

export default VideoUpload;
