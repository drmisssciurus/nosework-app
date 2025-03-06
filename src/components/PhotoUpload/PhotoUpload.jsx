import { useState } from 'react';
import heic2any from 'heic2any';

import arrowBack from '../../assets/icons/icon-arrow-left.svg';
import styles from './PhotoUpload.module.css';

function PhotoUpload({ closeModal, onUpload }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  async function convertHEICtoJPG(file) {
    try {
      const blob = await heic2any({ blob: file, toType: 'image/jpeg' });
      return new File([blob], file.name.replace('.heic', '.jpg'), {
        type: 'image/jpeg',
      });
    } catch (error) {
      console.error('HEIC conversion error:', error);
      return file;
    }
  }

  async function handleImageChange(event) {
    let file = event.target.files[0];

    if (file) {
      if (file.type === 'image/heic' || file.name.endsWith('.heic')) {
        file = await convertHEICtoJPG(file);
      }
      setFile(file);
      createPreview(file);
    }
  }

  function createPreview(imageFile) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(imageFile);
  }

  function handleUpload() {
    if (file) {
      onUpload(file);
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
        {preview && (
          <img
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'contain',
            }}
            src={preview}
            alt="Preview"
          />
        )}
        <button
          className={styles.btnUpload}
          onClick={handleUpload}
          disabled={!file}
        >
          העלאה
        </button>
      </div>
    </div>
  );
}

export default PhotoUpload;
