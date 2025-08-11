import React from 'react';
import { Zap } from 'lucide-react';
import styles from './LoadingScreen.module.css';

const LoadingScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Zap className={styles.icon} />
        <h2 className={styles.title}>Loading SQL Valley</h2>
        <p className={styles.subtitle}>Initializing database...</p>
        <div className={styles.progress}>
          <div className={styles.progressBar} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;