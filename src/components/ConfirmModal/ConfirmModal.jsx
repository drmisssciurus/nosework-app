import Modal from 'react-modal';
import Button from '../Button/Button';
import styles from './ConfirmModal.module.css';
import Icons from '../Icons';

Modal.setAppElement('#root');

function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  message = 'Are you sure?',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.modalContainer}>
        <div className={styles.headerWrapper}>
          <div onClick={onCancel}>
            <Icons name="close" />
          </div>
          <h2 className={styles.title}>יציאה מאימון</h2>
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonGroup}>
          <button className={styles.btnCancel} onClick={onCancel}>
            ביטול וחזרה לאימון
          </button>
          <button className={styles.btnConfirm} onClick={onConfirm}>
            יציאה למסך הבית
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
