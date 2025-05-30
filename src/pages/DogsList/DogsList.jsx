import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { calculateAge, formatDate } from '../../utils/utils';
import Modal from 'react-modal';

import styles from './DogsList.module.css';

import NavBar from '../../components/NavBar/NavBar';
import Header from '../../components/Header/Header';
import Dogs from '../../components/Dogs/Dogs';
import Button from '../../components/Button/Button';

Modal.setAppElement('#root');

function DogsList() {
  const navigate = useNavigate();

  // State variables
  const [dogs, setDogs] = useState([]); // Array of dog objects with extra fields
  const [loading, setLoading] = useState(true); // Loading indicator for initial fetch
  const [error, setError] = useState(null); // Error message, if fetch fails
  const [selectedDog, setSelectedDog] = useState(null); // Dog selected for deletion
  const [isModalOpen, setIsModalOpen] = useState(false); // Whether delete confirmation modal is open

  /**
   * Fetch the list of dogs for the current user, then
   * for each dog determine whether it has any sessions.
   * Adds `age`, `formattedDate`, and `hasSessions` properties.
   */
  async function fetchDogs() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('There is no token');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing in localStorage');
      setLoading(false);
      return;
    }

    try {
      // Retrieve dogs by user ID
      const response = await fetch(`/api/Dog/byUserId/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Error data loading');
      }

      const data = await response.json();

      // For each dog, fetch analysis stats to know if sessions exist
      const dogsWithSessions = await Promise.all(
        data.map(async (dog) => {
          let hasSessions = false;

          try {
            const statsRes = await fetch(`/api/Dog/analysis/${dog.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (statsRes.ok) {
              const stats = await statsRes.json();
              hasSessions = stats.numberOfSessions > 0;
            }
          } catch {
            console.warn(`No sessions for dog ${dog.id}`);
          }

          return {
            ...dog,
            age: calculateAge(dog.dateOfBirth),
            formattedDate: formatDate(dog.dateOfBirth),
            hasSessions,
          };
        })
      );

      setDogs(dogsWithSessions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Open delete confirmation modal for selected dog
  function openModal(dog) {
    setSelectedDog(dog);
    setIsModalOpen(true);
  }

  // Close the delete confirmation modal
  function closeModal() {
    setSelectedDog(null);
    setIsModalOpen(false);
  }

  /**
   * Delete the selected dog via API and remove from state.
   * Closes modal on success.
   */
  async function handleDeleteDog() {
    if (!selectedDog) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/Dog/${selectedDog.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to delete dog');
      }
      setDogs((prevDogs) =>
        prevDogs.filter((dog) => dog.id !== selectedDog.id)
      );
      closeModal();
    } catch (error) {
      console.error('Error deleting dog:', error);
    }
  }

  // Fetch dogs when component mounts
  useEffect(() => {
    fetchDogs();
  }, []);

  return (
    <div className="container">
      <div className={styles.content}>
        <Header>הכלבים שלנו</Header>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {/* Dogs list once loaded */}
        {!loading && !error && (
          <div>
            <ul className={styles.wrapper}>
              <Dogs dogs={dogs} onDelete={openModal} />
            </ul>
          </div>
        )}
        <Button className={styles.btnDog} onClick={() => navigate('/add_dog')}>
          הוספת כלב חדש
        </Button>
        <NavBar />
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <p className={styles.titleModal}>
          האם אתה בטוח שברצונך למחוק את {selectedDog?.name}?
        </p>
        <div className={styles.modalActions}>
          <button className={styles.btnYes} onClick={handleDeleteDog}>
            אישור
          </button>
          <button className={styles.btnNo} onClick={closeModal}>
            ביטול
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default DogsList;
