/* eslint-disable react/prop-types */
import { useState } from 'react';
import styles from './SessionsList.module.css';
import SessionItem from '../SessionItem/SessionItem';

function SessionsList({ sessions }) {
  return (
    <ul className={styles.wrapper}>
      {sessions.map((session) => (
        <SessionItem session={session} key={session.id} />
      ))}
    </ul>
  );
}
export default SessionsList;
