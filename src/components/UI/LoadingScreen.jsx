// LoadingScreen.jsx
import React from 'react';
import { GraduationCap } from 'lucide-react';
import styles from './LoadingScreen.module.css';

const LoadingScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <GraduationCap className={styles.icon} />
        <h2 className={styles.title}>Loading SQL Valley</h2>
        <div className={styles.progress}>
          <div className={styles.progressBar} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;