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
    setUploadedPhoto(image);
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
      id: 0,
      name: dogName,
      breed: dogBreed,
      dateOfBirth: new Date(dogBirth).toISOString(),
    };

    try {
      const response = await fetch('/api/Dog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dogData),
      });

      if (!response.ok) {
        throw new Error('Error sending data');
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
            {uploadedPhoto && <p>Фото загружено!</p>}
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <Button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'מוֹסִיף...' : 'הוסף'}
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
