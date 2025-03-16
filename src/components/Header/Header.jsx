import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import Icons from '../Icons';

function Header({ children }) {
  const navigate = useNavigate();

  return (
    <div className={styles.titlewrapper}>
      <button
        className={styles.btnBack}
        type="back"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        <Icons name="arrowLeft" />
      </button>
      <h2 className={styles.title}>{children}</h2>
    </div>
  );
}

export default Header;
