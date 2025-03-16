import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainPage.module.css';

import NavBar from '../../components/NavBar/NavBar';
import Calendar from '../../components/Calendar/Calendar';
import SessionsList from '../../components/SessionsList/SessionsList';
import Button from '../../components/Button/Button';

import logo from '../../assets/logo-dog.png';
import Icons from '../../components/Icons';

const today = new Date().toLocaleDateString('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function MainPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/User/Logout', { method: 'POST' });
    } catch (error) {
      console.error('Error while exiting:', error);
    }

    localStorage.removeItem('token');
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
            <h2 className={styles.text}>שלום,</h2>
            <h2 className={styles.text}>היום,{today}</h2>
          </div>
        </header>

        <main>
          <div className={styles.container}>
            <p className={styles.message}>
              על מנת להמשיך באימון יש להוסיף כלב קודם
            </p>
            <div
              className={styles.menuItem}
              onClick={() => navigate('/add_dog')}
            >
              <Icons name="arrowLeft" />
              <p className={styles.title}>הוסף כלב חדש</p>
            </div>
            <div className={styles.menuItem}>
              <Icons name="arrowLeft" />
              <p className={styles.title}>התחל אימון חדש</p>
            </div>
            <div className={styles.menuItem}>
              <Icons name="arrowLeft" />
              <p className={styles.title}>הסטוריית האימונים שלי</p>
            </div>
            <div className={styles.menuItem}>
              <Icons name="arrowLeft" />
              <p className={styles.title}>קצת על האפליקציה</p>
            </div>
            <div className={styles.menuItem} onClick={handleLogout}>
              <Icons name="arrowLeft" />

              <p className={styles.title}>התנתק</p>
            </div>
          </div>
          <div className={styles.btnWrapper}>
            {/* <Button
              className={styles.btn}
              onClick={() => navigate('/create_session')}
            >
              צור תוכנית אימון
            </Button> */}
            {/* 
            <Button className={styles.btnLogout} onClick={handleLogout}>
              התנתק
            </Button> */}
          </div>
        </main>

        <NavBar />
      </div>
    </div>
  );
}

export default MainPage;
