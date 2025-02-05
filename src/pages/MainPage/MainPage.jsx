import { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import styles from './MainPage.module.css';

function MainPage() {
  const [userName, setUserName] = useState('אוריאל');

  return (
    <div className="container">
      <div className={styles.mainpage}>
        <h1>שלום, {userName}</h1>
        <p>date</p>
        <p>calendar</p>
        <p>session list</p>
        <ul>
          <li>1</li>
          <li>2</li>
        </ul>
        <NavBar />
      </div>
    </div>
  );
}

export default MainPage;
