import { useNavigate } from 'react-router-dom';
import styles from './MainPage.module.css';

import NavBar from '../../components/NavBar/NavBar';

import logo from '../../assets/logo-dog.png';
import Icons from '../../components/Icons';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Button from '../../components/Button/Button';

const today = new Date().toLocaleDateString('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

Modal.setAppElement('#root');

function MainPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');
  const [hasDogs, setHasDogs] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;

        const response = await fetch(`/api/Dog/byUserId/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch dogs');

        const dogs = await response.json();
        setHasDogs(dogs.length > 0);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };

    fetchDogs();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await fetch('/api/User/Logout', { method: 'POST' });
    } catch (error) {
      console.error('Error while exiting:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    navigate('/login');
  };

  return (
    <div className="container">
      <div className={styles.mainPage}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <div>
            <h2 className={styles.text}>שלום {userName}</h2>
            <h2 className={styles.text}>היום, {today}</h2>
          </div>
        </header>

        <main>
          <div className={styles.container}>
            {!hasDogs && (
              <p className={styles.message}>
                על מנת להמשיך באימון יש להוסיף כלב קודם
              </p>
            )}
            <div
              className={styles.menuItem}
              onClick={() => navigate('/add_dog')}
            >
              <Icons name="arrowLeft" />
              <p className={styles.title}>הוסף כלב חדש</p>
            </div>

            <div
              className={`${styles.menuItem} ${
                !hasDogs ? styles.disabled : ''
              }`}
              onClick={() => hasDogs && navigate('/create_session')}
            >
              <Icons name="arrowLeft" />
              <p className={styles.title}>התחל אימון חדש</p>
            </div>

            <div
              className={`${styles.menuItem} ${
                !hasDogs ? styles.disabled : ''
              }`}
              onClick={() => hasDogs && navigate('/sessions_page')}
            >
              <Icons name="arrowLeft" />
              <p className={styles.title}>הסטוריית האימונים שלי</p>
            </div>

            <div className={styles.menuItem} onClick={() => openModal()}>
              <Icons name="arrowLeft" />
              <p className={styles.title}>Noseworks על האפליקציה </p>
            </div>
            <div className={styles.menuItem} onClick={handleLogout}>
              <Icons name="arrowLeft" />

              <p className={styles.title}>התנתק</p>
            </div>
          </div>
          <div className={styles.btnWrapper}></div>
        </main>

        <NavBar />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <p className={styles.aboutUsPage}>
          The Noseworks app is being developed by the Tech4Animals Lab at the
          University of Haifa in collaboration with the Animal for Security
          Section, IMOD. Noseworks is an app for tracking and analyzing sniffing
          trainings of working dogs. The app is for the use of the IK9
          community.
        </p>
        <p className={styles.aboutUsPage}>
          For feedback, requests and additions, please send a message to Prof.
          <br />
          <a
            href="https://wa.me/972545402870"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappLink}
          >
            Anna Zamansky.
          </a>
        </p>
        <Button onClick={() => closeModal()}>לסגור</Button>
      </Modal>
    </div>
  );
}

export default MainPage;
