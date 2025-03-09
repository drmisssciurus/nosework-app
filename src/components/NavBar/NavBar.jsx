import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';
import Icons from '../Icons';

function NavBar() {
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
            to="/analysis"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <Icons name="analysis" />
          </NavLink>
        </li>
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
