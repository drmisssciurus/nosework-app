import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

function NavBar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.wrapper}>
        <li className={styles.item}>
          {/* исправить на спрайты?? */}
          <NavLink to="/mainpage">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 23 28"
              width="23"
              height="28"
              fill="none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                width="23"
                height="23"
                fill="#030303"
                x="0"
                y="2.5"
                opacity="100%"
              >
                <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path>
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
          </NavLink>
        </li>
        <li className={styles.item}>
          <NavLink to="/newsession">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 23 28"
              width="23"
              height="28"
              fill="none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="23"
                width="23"
                viewBox="0 0 24 24"
                fill="#000"
                x="0"
                y="2.5"
                opacity="100%"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
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
          </NavLink>
        </li>
        <li className={styles.item}>
          <NavLink to="/analysis">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 28"
              width="20"
              height="28"
              fill="none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="20"
                height="20"
                fill="#030303"
                x="0"
                y="4"
                opacity="100%"
              >
                <path d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"></path>
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
          </NavLink>
        </li>
        <li className={styles.item}>
          <NavLink to="/dogs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 28"
              width="20"
              height="28"
              fill="none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="20"
                height="20"
                fill="#030303"
                x="0"
                y="4"
                opacity="100%"
              >
                <path d="M496 96h-64l-7.16-14.31A32 32 0 0 0 396.22 64H342.6l-27.28-27.28C305.23 26.64 288 33.78 288 48.03v149.84l128 45.71V208h32c35.35 0 64-28.65 64-64v-32c0-8.84-7.16-16-16-16zm-112 48c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16zM96 224c-17.64 0-32-14.36-32-32 0-17.67-14.33-32-32-32S0 174.33 0 192c0 41.66 26.83 76.85 64 90.1V496c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V384h160v112c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V277.55L266.05 224H96z"></path>
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
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
