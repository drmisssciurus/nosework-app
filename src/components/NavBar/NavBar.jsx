import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';
import Icons from '../Icons';

function NavBar() {
  const [hasDogs, setHasDogs] = useState(false);
  const userId = localStorage.getItem('userId');

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

  return (
    <nav className={styles.nav}>
      <ul className={styles.wrapper}>
        <li className={styles.item}>
          <NavLink
            to="/mainpage"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <Icons name="home" />
          </NavLink>
        </li>
        {hasDogs && (
          <>
            <li className={styles.item}>
              <NavLink
                to="/create_session"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                <Icons name="newsession" />
              </NavLink>
            </li>
            <li className={styles.item}>
              <NavLink
                to="/sessions_page"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                <Icons name="sessions" />
              </NavLink>
            </li>
          </>
        )}
        <li className={styles.item}>
          <NavLink
            to="/dogs"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <Icons name="dogs" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
