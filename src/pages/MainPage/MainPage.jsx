import { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import NavBar from '../../components/NavBar/NavBar';
import Calendar from '../../components/Calendar/Calendar';
import logo from '../../assets/logo-dog.png';
import styles from './MainPage.module.css';

const today = new Date().toLocaleDateString('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function MainPage() {
  const [userName, setUserName] = useState('אוריאל');
  return (
    <div className="container">
      <div className={styles.mainpage}>
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
          <p>האימונים שלי</p>
          <ul>
            <li>1</li>
            <li>2</li>
          </ul>
        </main>

        <NavBar />
      </div>
    </div>
  );
}

export default MainPage;
