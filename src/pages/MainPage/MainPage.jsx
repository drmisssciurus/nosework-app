import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from '../../components/NavBar/NavBar';
import Calendar from '../../components/Calendar/Calendar';
import SessionsList from '../../components/SessionsList/SessionsList';
import Button from '../../components/Button/Button';

import logo from '../../assets/logo-dog.png';
import styles from './MainPage.module.css';

const today = new Date().toLocaleDateString('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const dummyData = [
  {
    id: 1,
    name: 'טאץ',
    session: 15,
    count: 2.506,
    status: true,
    button: 'ראה נתונים',
  },
  {
    id: 2,
    name: 'פומה',
    session: 15,
    count: 2.506,
    status: false,
    button: 'ראה נתונים',
  },
];

function MainPage() {
  const [sessions, setSessions] = useState(dummyData);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/User/Logout', { method: 'POST' });
    } catch (error) {
      console.error('Error while exiting:', error);
    }

    localStorage.removeItem('token');
    console.log('Token removed:', localStorage.getItem('token'));
    navigate('/login');
    // window.location.reload();
  };

  return (
    <div className="container">
      <div className={styles.mainPage}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <div>
            <h2 className={styles.text}>שלום,</h2>
            <h2 className={styles.text}>היום,{today}</h2>
          </div>
        </header>

        <Calendar />
        <main>
          <p className={styles.title}>האימונים שלי</p>

          <SessionsList sessions={sessions} />

          <div className={styles.btnWrapper}>
            <Button
              className={styles.btn}
              onClick={() => navigate('/create_session')}
            >
              צור תוכנית אימון
            </Button>

            <Button className={styles.btnLogout} onClick={handleLogout}>
              התנתק
            </Button>
          </div>
        </main>

        <NavBar />
      </div>
    </div>
  );
}

export default MainPage;
