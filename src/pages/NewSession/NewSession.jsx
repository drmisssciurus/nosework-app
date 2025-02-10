import { useNavigate } from 'react-router-dom';
import styles from './NewSession.module.css';
import NavBar from '../../components/NavBar/NavBar';

function NewSession() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div>
        <div className={styles.titlewrapper}>
          <button
            className={styles.btnBack}
            type="back"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 28"
              width="18"
              height="28"
              fill="none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="18"
                height="18"
                fill="#030303"
                x="0"
                y="5"
                opacity="100%"
              >
                <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
              </svg>
              <defs>
                <filter
                  id="filter_dshadow_0_0_0_00000014"
                  filterUnits="userSpaceOnUse"
                >
                  <feFlood result="bg-fix"></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="alpha"
                  ></feColorMatrix>
                  <feOffset dx="0" dy="0"></feOffset>
                  <feGaussianBlur stdDeviation="0"></feGaussianBlur>
                  <feComposite in2="alpha" operator="out"></feComposite>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="normal"
                    in2="bg-fix"
                    result="bg-fix-filter_dshadow_0_0_0_00000014"
                  ></feBlend>
                  <feBlend
                    in="SourceGraphic"
                    in2="bg-fix-filter_dshadow_0_0_0_00000014"
                    result="shape"
                  ></feBlend>
                </filter>
              </defs>
            </svg>
          </button>
          <h2 className={styles.title}>הוספת אימון חדש</h2>
        </div>
        <p className={styles.sessionname}>אימון מספר 19</p>
        <p className={styles.sessionsubtitle}>
          מספר מעודכן אוטומטית לפי הכלב המתאמן
        </p>

        <form action="" className={styles.form}>
          <div className={styles.itemwrapper}>
            <label className={styles.label} htmlFor="">
              תאריך
            </label>
            <input
              className={styles.iteminput}
              type="text"
              placeholder="היום"
            />
            <p className={styles.date}>DD/MM/YYYY : פורמט</p>
          </div>

          <div className={styles.selectwrapper}>
            <label className={styles.label}>שם הכלב</label>

            <select className={styles.item} name="dog name" id="">
              <option value="">dog1</option>
              <option value="">dog2</option>
              <option value="">dog3</option>
            </select>
          </div>

          <div className={styles.selectwrapper}>
            <label className={styles.label} htmlFor="">
              שם מאמן
            </label>

            <select className={styles.item} name="trainer name" id="">
              <option value="">trainer1</option>
              <option value="">trainer2</option>
              <option value="">trainer3</option>
            </select>
          </div>

          <div className={styles.selectwrapper}>
            <label className={styles.label} htmlFor="">
              מספר שליחות
            </label>
            <select className={styles.item} name="number of trials" id="">
              <option value="">1</option>
              <option value="">2</option>
              <option value="">3</option>
            </select>
          </div>
          <div className={styles.selectwrapper}>
            <label className={styles.label} htmlFor="">
              סוגי מכולות
            </label>

            <select className={styles.item} name="x" id="">
              <option value="">1</option>
              <option value="">2</option>
              <option value="">3</option>
            </select>
          </div>

          <div className={styles.checkbox}>
            <label className={styles.label}>X קיימת שליחה</label>
            <input type="checkbox" />
          </div>
        </form>
        <button className={styles.button}>ערוך תוכנית אימון</button>
      </div>
      <NavBar />
    </div>
  );
}

export default NewSession;
