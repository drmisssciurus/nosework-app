import { useState } from 'react';
import Modal from 'react-modal';

import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import PhotoUpload from '../../components/PhotoUpload/PhotoUpload';

import styles from './AddDog.module.css';
import Icons from '../../components/Icons';

Modal.setAppElement('#root');

function AddDog() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  const openModal = () => setIsModalOpen(true);

  function handleUploadPhoto(image) {
    setUploadedPhoto(image);
  }

  return (
    <div className="container">
      <div>
        <Header>הוספת כלב חדש</Header>
        <form action="" className={styles.wrapper}>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="">
              שם הכלב
            </label>
            <input
              className={styles.iteminput}
              type="text"
              placeholder="הכנס שם הכלב"
            />
          </div>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="">
              גזע
            </label>
            <input
              className={styles.iteminput}
              type="text"
              placeholder="הכנס גזע"
            />
          </div>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="">
              תאריך לידה
            </label>
            <input
              className={styles.iteminput}
              type="text"
              placeholder="הכנס תאריך לידה"
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
          </div>
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
