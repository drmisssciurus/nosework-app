import { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Calendar from '../../components/Calendar/Calendar';
import logo from '../../assets/logo-dog.png';
import styles from './MainPage.module.css';
import SessionsList from '../../components/SessionsList/SessionsList';
import { Link, useNavigate } from 'react-router-dom';

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
  {
    id: 3,

    name: 'פומה',
    session: 15,
    count: 2.506,
    status: false,
    button: 'ראה נתונים',
  },
  {
    id: 4,

    name: 'פומה',
    session: 15,
    count: 2.506,
    status: false,
    button: 'ראה נתונים',
  },
  {
    id: 5,

    name: 'פומה',
    session: 15,
    count: 2.506,
    status: false,
    button: 'ראה נתונים',
  },
];

function MainPage() {
  const [userName, setUserName] = useState('אוריאל');
  const [sessions, setSessions] = useState(dummyData);

  const navigate = useNavigate(); ////

  //delete
  console.log(sessions);

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   navigate('/login');
  // };

  const handleLogout = async () => {
    try {
      await fetch('/api/User/Logout', { method: 'POST' }); // Если сервер требует разлогин
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }

    localStorage.removeItem('token');
    console.log('Token removed:', localStorage.getItem('token')); // Должно быть null
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="container">
      <div>
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <div>
            <h2 className={styles.text}>שלום, {userName}</h2>
            <h2 className={styles.text}>היום,{today}</h2>
          </div>
        </header>

        <Calendar />
        <main>
          <p className={styles.title}>האימונים שלי</p>

          <SessionsList sessions={sessions} />

          <Link to="/create_session">
            <button className={styles.btn}>צור תוכנית אימון</button>
          </Link>
          <button className={styles.btn} onClick={handleLogout}>
            התנתק
          </button>
        </main>

        <NavBar />
      </div>
    </div>
  );
}

export default MainPage;
