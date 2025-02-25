import { useState } from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import styles from './Calendar.module.css';

const hebrewDays = ['ב', 'ג', 'ד', 'ה', 'ו', 'ש', 'א'];

const Calendar = () => {
  const [currentDate] = useState(new Date());

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });

  const weekDays = Array.from({ length: 7 })
    .map((_, index) => addDays(startOfCurrentWeek, index))
    .reverse();

  return (
    <div>
      <div className={styles.wrapper}>
        {weekDays.map((day, index) => (
          <div key={index} className={styles.day}>
            <span className={styles.weekday}>{hebrewDays[index]}</span>
            <div className={`${isToday(day) ? styles.today : styles.date}`}>
              <span>{format(day, 'd')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
