import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styles from './DogAnalysis.module.css';

import NavBar from '../../components/NavBar/NavBar';
import Icons from '../../components/Icons';
import { formatDogAge } from '../../utils/utils';

function DogAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dogData, setDogData] = useState(null);
  const [dogStats, setDogStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDogData() {
      if (!id) return;
      const token = localStorage.getItem('token');
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const [dogResponse, statsResponse] = await Promise.all([
          fetch(`/api/Dog/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`/api/Dog/analysis/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!dogResponse.ok) {
          throw new Error(`Dog fetch error: ${dogResponse.statusText}`);
        }
        if (!statsResponse.ok) {
          throw new Error(`Dog stats fetch error: ${statsResponse.statusText}`);
        }

        const dogData = await dogResponse.json();
        const statsData = await statsResponse.json();

        setDogData(dogData);
        setDogStats(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDogData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!dogData) {
    return null;
  }

  const { name, breed, dateOfBirth, imageUrl } = dogData;
  const { numberOfSessions, hitCount, dPrimes, totalTrials, lastDPrime } =
    dogStats;

  function calculateDogAgeInMonths(dateString) {
    if (!dateString) return null;

    const birthDate = new Date(dateString);
    if (isNaN(birthDate.getTime())) return null;

    const now = new Date();
    let months =
      (now.getFullYear() - birthDate.getFullYear()) * 12 +
      (now.getMonth() - birthDate.getMonth());

    if (now.getDate() < birthDate.getDate()) {
      months -= 1;
    }

    return months;
  }

  const successRate =
    dogStats.totalTrials > 0
      ? Math.round((dogStats.hitCount / dogStats.totalTrials) * 100)
      : 0;

  return (
    <div className="container">
      <button
        className={styles.btnBack}
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        <Icons name="arrowLeft" />
      </button>
      <div className={styles.dogInfo}>
        <div className={styles.imgContainer}>
          {imageUrl ? (
            <img className={styles.dogImage} src={imageUrl} alt={name} />
          ) : (
            <span className={styles.fallbackText}>{name}</span>
          )}
        </div>
        {imageUrl ? <p className={styles.dogName}>{name}</p> : ''}
        <div className={styles.dogInfoContainer}>
          <p className={styles.dogText}>
            {formatDogAge(calculateDogAgeInMonths(dateOfBirth))}{' '}
          </p>
          <div className={styles.dogBreedWrapper}>
            <p className={styles.dogText}>{breed}</p>
            <p className={styles.dogText}>:גזע</p>
          </div>
        </div>
      </div>
      <div className={styles.statsWrapper}>
        <h2 className={styles.statsTitle}>התקדמות האימונים</h2>
        <div className={styles.statsContainer}>
          <div className={styles.statsItems}>
            <Icons name="dogAnalysis" />
            <div>
              <p className={styles.statsNumber}>{lastDPrime}</p>
              <p className={styles.statsDescription}>די-פריים אחרון</p>
            </div>
          </div>
          <div className={styles.statsItems}>
            <Icons name="dogSessions" />
            <div>
              <p className={styles.statsNumber}>{numberOfSessions}</p>
              <p className={styles.statsDescription}>מספר אימונים</p>
            </div>
          </div>
          <div className={styles.statsItems}>
            <Icons name="dogHits" />
            <div>
              <p className={styles.statsNumber}>{totalTrials}</p>
              <p className={styles.statsDescription}>מספר שליחות</p>
            </div>
          </div>
          <div className={styles.statsItems}>
            <Icons name="dogSucsess" />
            <div>
              <p className={styles.statsNumber}>{successRate}%</p>
              <p className={styles.statsDescription}>אחוזי הצלחה של </p>
              <p className={styles.statsDescription}>{name}</p>
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  );
}

export default DogAnalysis;
