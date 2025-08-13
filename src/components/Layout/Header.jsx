import React from 'react';
import { GraduationCap, Award, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Header.module.css';

const Header = () => {
  const { totalPoints, completedExercises, progressPercentage } = useApp();
  const totalExercises = 7;
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <GraduationCap className={styles.logo} />
          <div>
            <h1 className={styles.title}>SQL Valley</h1>
            <p className={styles.subtitle}>TU/e Database Learning Platform</p>
          </div>
        </div>
        
        <div className={styles.progress}>
          <div className={styles.stat}>
            <CheckCircle size={18} />
            <span>{completedExercises.length}/{totalExercises} Completed</span>
          </div>
          
          <div className={styles.stat}>
            <Award size={18} />
            <span>{totalPoints} Points</span>
          </div>
          
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progressPercentage}%` }}
            />
            <span className={styles.progressText}>{progressPercentage}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;