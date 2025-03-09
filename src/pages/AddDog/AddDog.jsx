import { useState } from 'react';
import Modal from 'react-modal';

import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import PhotoUpload from '../../components/PhotoUpload/PhotoUpload';

import styles from './AddDog.module.css';
import Icons from '../../components/Icons';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function AddDog() {
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogBirth, setDogBirth] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);

  function handleUploadPhoto(image) {
    if (image instanceof File) {
      setUploadedPhoto(image);
    } else {
      console.error('Uploaded photo is not a File object:', image);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing.');
      setLoading(false);
      return;
    }

    const dogData = {
      name: dogName,
      breed: dogBreed,
      dateOfBirth: new Date(dogBirth).toISOString(),
      imageUrl: '',
    };

    try {
      const response = await fetch('/api/Dog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dogData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error creating dog: ${errorMessage}`);
      }

      const createdDog = await response.json();
      const dogId = createdDog.id;

      if (uploadedPhoto && dogId) {
        const formData = new FormData();
        formData.append('file', uploadedPhoto);

        const uploadResponse = await fetch(`/api/Dog/uploadImage/${dogId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.text();
          throw new Error(`Error uploading photo: ${uploadError}`);
        }
      }
      setDogName('');
      setDogBreed('');
      setDogBirth('');
      setUploadedPhoto(null);
      navigate('/dogs');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div>
        <Header>הוספת כלב חדש</Header>
        <form className={styles.wrapper} onSubmit={handleSubmit}>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="dogName">
              שם הכלב
            </label>
            <input
              className={styles.iteminput}
              type="text"
              id="dogName"
              placeholder="הכנס שם הכלב"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              required
            />
          </div>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="dogBreed">
              גזע
            </label>
            <input
              className={styles.iteminput}
              type="text"
              id="dogBreed"
              placeholder="הכנס גזע"
              value={dogBreed}
              onChange={(e) => setDogBreed(e.target.value)}
              required
            />
          </div>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="dogBirth">
              תאריך לידה
            </label>
            <input
              className={styles.iteminput}
              type="date"
              lang="he"
              id="dogBirth"
              value={dogBirth}
              onChange={(e) => setDogBirth(e.target.value)}
              required
            />
          </div>
          <div className={styles.itemwrapper}>
            <p className={styles.label}>תמונה</p>
            <button
              className={styles.btnUpload}
              type="button"
              onClick={openModal}
            >
              העלאה
              <Icons name="upload" />
            </button>
            {uploadedPhoto && (
              <p style={{ textAlign: 'center' }}>התמונה הועלתה!</p>
            )}
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <Button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'מוסיף...' : 'הוסף'}
          </Button>
        </form>
        <NavBar />
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <PhotoUpload
          closeModal={() => setIsModalOpen(false)}
          onUpload={handleUploadPhoto}
        />
      </Modal>
    </div>
  );
}

export default AddDog;
