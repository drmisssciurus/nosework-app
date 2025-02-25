import { useState } from 'react';

import arrowBack from '../../assets/icons/icon-arrow-left.svg';
import styles from './PhotoUpload.module.css';

function PhotoUpload({ closeModal, onUpload }) {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function handleUpload() {
    if (image) {
      onUpload(image);
      closeModal();
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <button className={styles.btnClose} onClick={closeModal}>
          <img src={arrowBack} alt="Back" />
        </button>

        <h2 className={styles.title}>העלאת תמונה</h2>
      </div>
      <div className={styles.modalContent}>
        <input
          type="file"
          accept="image/*"
          className={styles.input}
          onChange={handleImageChange}
        />
        {image && (
          <img
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'contain',
            }}
            src={image}
            alt="Preview"
          />
        )}
        <button
          className={styles.btnUpload}
          onClick={handleUpload}
          disabled={!image}
        >
          העלאה
        </button>
      </div>
    </div>
  );
}

export default PhotoUpload;
